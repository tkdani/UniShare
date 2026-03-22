import {
  Upload,
  Search,
  Heart,
  Bookmark,
  MessageCircle,
  User,
  Shield,
  FileText,
  ImageIcon,
  Code,
  Home,
  Ban,
  Mail,
} from "lucide-react";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function DocCard({ icon, title, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="font-semibold text-foreground">{title}</h2>
      </div>
      <div className="text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
        {number}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Documentation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know about using UniShare.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DocCard icon={<Mail className="h-4 w-4" />} title="Getting Started">
          <p className="mb-2">
            Create an account with your email address and choose a username.
            After signing up you'll receive a verification email — confirm it to
            activate your account.
          </p>
          <p>
            Once logged in, you can set your full name and upload a profile
            picture from the Profile page.
          </p>
        </DocCard>

        <DocCard icon={<Home className="h-4 w-4" />} title="Home">
          <p>
            The Home page shows a feed of recently uploaded files from all
            users. You can like or save any file directly from the feed, or
            click on a card to open the full view.
          </p>
        </DocCard>

        <DocCard icon={<Upload className="h-4 w-4" />} title="Uploading Files">
          <p className="mb-2">Each file is organized by:</p>
          <div className="mb-3 space-y-0.5">
            <Step number={1} text="University" />
            <Step number={2} text="Course" />
            <Step number={3} text="Type — Lecture or Exam (optional)" />
            <Step number={4} text="Lesson number (optional)" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Tag>
              <FileText className="h-3 w-3" /> PDF
            </Tag>
            <Tag>
              <ImageIcon className="h-3 w-3" /> Images
            </Tag>
            <Tag>
              <Code className="h-3 w-3" /> Code
            </Tag>
          </div>
        </DocCard>

        <DocCard icon={<Search className="h-4 w-4" />} title="Browsing Notes">
          <p>
            On the Notes page, files are listed in a tree structure on the left,
            organized as a breadcrumb hierarchy:
          </p>
          <p className="mt-2 font-medium text-foreground text-xs">
            University → Course → Lecture/Exam → File
          </p>
          <p className="mt-2">
            Click any file in the tree to open it in the main viewer.
          </p>
        </DocCard>

        <DocCard icon={<Heart className="h-4 w-4" />} title="Liking & Saving">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Heart className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-500" />
              <span>
                <span className="font-medium text-foreground">Like</span> — show
                appreciation for useful material
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Bookmark className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                <span className="font-medium text-foreground">Save</span> — add
                to your saved list
              </span>
            </div>
            <div className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
              <span>
                <span className="font-medium text-foreground">Comment</span> —
                leave a comment on the file
              </span>
            </div>
          </div>
        </DocCard>

        <DocCard icon={<Bookmark className="h-4 w-4" />} title="Saved Files">
          <p>
            Files you save are collected on the{" "}
            <span className="font-medium text-foreground">Saved</span> page,
            giving you a personal library of materials to return to later.
          </p>
        </DocCard>

        <DocCard icon={<User className="h-4 w-4" />} title="Profile">
          <div className="space-y-0.5 mb-2">
            <Step number={1} text="Upload or change your avatar" />
            <Step number={2} text="Set your full name" />
            <Step number={3} text="Sign out" />
          </div>
          <p>
            You can view any user's public profile by clicking their username
            anywhere in the app.
          </p>
        </DocCard>

        <DocCard icon={<Ban className="h-4 w-4" />} title="Blocking Users">
          <p>
            On any file you own, you can block a user who has commented. A
            blocked user can still see your content but cannot like or comment
            on your files.
          </p>
          <p className="mt-2">
            You can unblock them at any time from the same menu.
          </p>
        </DocCard>

        <DocCard icon={<Shield className="h-4 w-4" />} title="Admin Panel">
          <p className="mb-2">
            Admin accounts have access to a dedicated panel where they can:
          </p>
          <div className="space-y-0.5">
            <Step number={1} text="View all registered users" />
            <Step number={2} text="Ban a user" />
            <Step number={3} text="Delete a user and all their data" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground/60">
            Admin accounts are assigned manually.
          </p>
        </DocCard>
      </div>
    </div>
  );
}
