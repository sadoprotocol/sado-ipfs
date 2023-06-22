const ONE_KB_IN_BYTES = 1024;
const MAXIMUM_FILE_SIZE = ONE_KB_IN_BYTES * 380; // 380Kb
const MAXIMUM_JSON_PAYLOAD_SIZE = MAXIMUM_FILE_SIZE + 20; // Added 20Kb as buffer -- i know its a lot
const ACCEPTED_MEDIA = [
	"application/json",
	"application/pdf",
	"text/csv",
	"text/plain",
	"image/jpeg",
	"image/bmp",
	"image/gif",
	"image/png",
	"image/svg+xml",
	"image/tiff",
	"image/webp",
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
] as const;

export { ACCEPTED_MEDIA, MAXIMUM_FILE_SIZE, MAXIMUM_JSON_PAYLOAD_SIZE, ONE_KB_IN_BYTES };