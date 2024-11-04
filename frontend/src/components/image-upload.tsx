import { NewOurFileRouter } from "@/hooks/use-uploadthing";
import { UploadDropzone } from "@/lib/uploadthing";

function ImageUpload() {
  return (
    <UploadDropzone<NewOurFileRouter>
      endpoint={"imageUploader"}
      onClientUploadComplete={(res) => {
        // Do something with the response
        console.log("Files: ", res);
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
      onUploadBegin={(name) => {
        // Do something once upload begins
        console.log("Uploading: ", name);
      }}
      onChange={(acceptedFiles) => {
        // Do something with the accepted files
        console.log("Accepted files: ", acceptedFiles);
      }}
    />
  );
}

export default ImageUpload;
