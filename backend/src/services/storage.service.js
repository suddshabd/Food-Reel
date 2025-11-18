import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export async function uploadFile(file, fileName) {
    return await imagekit.upload({
        file: file,     // Buffer from multer
        fileName: fileName,   // name to store in cloud
    });
}

export default uploadFile;