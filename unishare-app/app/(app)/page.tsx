import HomePageComp from "@/components/HomePage";

export default function HomePage() {
  return (
    <main>
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          UniShare
        </h1>
        <p className="mt-2 text-muted-foreground">
          UniShare is a platform built for university students to share and
          discover learning materials. Upload your notes, assignments, and study
          files and explore what others have shared across courses and
          universities. Like the content you find helpful, save it for later,
          and join the conversation with comments.
        </p>
      </div>
      <HomePageComp />
    </main>
  );
}
