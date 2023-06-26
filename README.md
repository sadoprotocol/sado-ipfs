# Sado IPFS

## Introduction

Decentralised storage solution for orders & offers metadata, and media files. 

Content stored on IPFS is accessed using [CID](https://docs.ipfs.tech/concepts/content-addressing/#what-is-a-cid) from any public gateway. Learn how IPFS works [here](https://docs.ipfs.tech).

## Setup

<sup>❗Ensure [Docker](https://docs.docker.com/engine/install) is installed</sup>

### Install core dependencies
<sup>Installs [Kubo IPFS daemon](https://docs.ipfs.tech/install/#ipfs-kubo) and MongoDb</sup>
```
docker compose up -d
```

### Configuration
<sup>If you make any changes to IPFS daemon or MongoDb configuration - update it. If not applicable, the default values would work out of the box.</sup>
```
cp .env.example .env
```

### Install app dependencies
```
npm install
```

### Start app in development mode
```
npm run start:dev
```
