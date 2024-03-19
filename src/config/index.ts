const TEMP_DIRECTORY = "/tmp/uploads";
const ONE_KB_IN_BYTES = 1024;
const MAXIMUM_FILE_SIZE = ONE_KB_IN_BYTES * 5000; // 5000Kb / 5Mb
const MAXIMUM_JSON_PAYLOAD_SIZE = MAXIMUM_FILE_SIZE + 20; // Added 20Kb as buffer -- i know its a lot
const ACCEPTED_MIME_TYPES = [
	"application/json",
	"application/pdf",
	"text/csv",
	"text/plain",
	"text/html",
	"image/jpeg",
	"image/bmp",
	"image/gif",
	"image/png",
	"image/svg+xml",
	"image/tiff",
	"image/webp",
	"image/avif",
	"audio/mpeg",
	"audio/webm",
	"audio/wav",
	"audio/ogg",
	"audio/midi",
	"audio/x-midi",
	"video/x-msvideo",
	"video/mp4",
	"video/mpeg",
	"video/ogg",
	"video/webm",
	"model/gltf+json",
	"model/gltf-binary"
];

export { ACCEPTED_MIME_TYPES, MAXIMUM_FILE_SIZE, MAXIMUM_JSON_PAYLOAD_SIZE, ONE_KB_IN_BYTES, TEMP_DIRECTORY };
