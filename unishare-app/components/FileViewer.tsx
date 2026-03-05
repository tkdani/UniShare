import Image from "next/image";

const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
const codeTypes = [
  "js",
  "ts",
  "tsx",
  "jsx",
  "py",
  "css",
  "html",
  "json",
  "c",
  "cpp",
];
const textTypes = ["txt", "md"];

function getFileType(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (imageTypes.includes(ext)) return "image";
  if (codeTypes.includes(ext)) return "code";
  if (textTypes.includes(ext)) return "text";
  if (ext === "pdf") return "pdf";
  return "unknown";
}

export default function FileViewer({ filename, publicUrl }: any) {
  const type = getFileType(filename);

  if (type === "image")
    return (
      <Image
        src={publicUrl}
        width={300}
        height={400}
        alt={filename}
        unoptimized
        loading="eager"
        className=""
      />
    );
  if (type === "pdf")
    return (
      <iframe
        title={filename}
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(publicUrl)}&embedded=true`}
        className="w-full h-96"
      />
    );
  /*
  if (type === "code")
    return <CodeViewer url={publicUrl} fileName={filename} />;
  if (type === "text") return <TextViewer url={publicUrl} />;
  */

  return <p>Nem támogatott fájltípus</p>;
}
