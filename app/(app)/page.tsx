import HomePageFeed from "@/components/HomePageFeed";
import { fetchUser } from "@/lib/fetchUser";

export default async function HomePage() {
  const user = await fetchUser();
  return (
    <main>
      <div className="container">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          UniShare
        </h1>
        {user && (
          <p className="text-xl tracking-tight">
            Hi {user.username}, good to see you again!
          </p>
        )}
        <p className="mt-2 text-muted-foreground">
          This application is developed as a thesis project by a BSc Computer Science student at Eötvös Loránd University.
          The platform is currently under active development, and additional features and improvements are expected in the future.
        </p>
        <p className="mt-2 text-muted-foreground">
          UniShare is a platform built for university students to share and
          discover learning materials. Upload your notes, assignments, and study
          files and explore what others have shared across courses and
          universities. Like the content you find helpful, save it for later,
          and join the conversation with comments.
        </p>
      </div>
      <HomePageFeed />
    </main>
  );
}
