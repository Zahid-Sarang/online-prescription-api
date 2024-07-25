import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { FileData, FileStorage } from "../types/storage";
import { Config } from "../config";
import createHttpError from "http-errors";

export class S3Storage implements FileStorage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: Config.S3_REGION!,
            credentials: {
                accessKeyId: Config.S3_ACCESS_KEY!,
                secretAccessKey: Config.S3_KEY_SECRET!,
            },
        });
    }

    async upload(data: FileData): Promise<void> {
        const objectParams = {
            Bucket: Config.S3_Bucket!,
            Key: data.fileName,
            Body: data.fileData,
        };
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
            return await this.client.send(new PutObjectCommand(objectParams));
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const error = createHttpError(400, "S3 Image upload failed");
            throw error;
        }
    }
    delete(filename: string): Promise<void> {
        throw new Error("delete not implemented" + filename);
    }
    getObjectUri(filename: string): string {
        const bucket = Config.S3_Bucket!;
        const region = Config.S3_REGION!;

        if (typeof bucket === "string" && typeof region === "string") {
            return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
        }
        const error = createHttpError(500, "Invalid S3 configuration");
        throw error;
    }
}
