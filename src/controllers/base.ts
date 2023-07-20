import { type Request, type Response } from "express";
import { type CID } from 'kubo-rpc-client'

import { saveContentData } from "../models/Content";
import { ipfsCore } from "../modules/IPFSCore";
import { generateGatewayURL, getContentMetadata } from "../utils";

async function healthCheck(_request: Request, response: Response): Promise<Response> {
    const ts = Date.now()
    const cid = await uploadSampleContent()
    let contentGatewayStatus = false

    if(cid !== false) {
        contentGatewayStatus = await isContentRetrievableFromGateway(cid)
    }
    
    return response.status(200).send({
        ts,
        node: !!cid,
        contentGateway: contentGatewayStatus
    })
}

async function uploadSampleContent(): Promise<CID | false> {
    try {
        const content = 'data:text/plain;base64,SGVsbG8gV29ybGQh'; // Hello World!
        const { buff, ...metadata } = getContentMetadata(content);
        const cid = await ipfsCore.add(buff, true);
        const pinned = await ipfsCore.isPinned(cid);
        await saveContentData({ cid, pinned, metadata });

        return cid
    } catch(error) {
        return false
    }
}

async function isContentRetrievableFromGateway(cid: CID): Promise<boolean> {
    try {
        const response = await fetch(generateGatewayURL(cid), {
            redirect: 'follow'
        })

        return response.status === 200
    } catch(error) {
        return false
    }
}

export {
    healthCheck
}