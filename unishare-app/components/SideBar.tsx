import CollapsibleFileTree from "./CollapsibleFileTree";
import DeepSearch from "./DeepSearch";
import { Separator } from "./ui/Separator";

export default function SideBar() {
  return (
    <div className="flex max-w-md w-1/5 flex-col gap-4 text-sm p-4 bg-sidebar rounded-md">
      <div className="text-2xl font-extrabold tracking-tight text-balance">
        Notes
      </div>
      <Separator />
      <DeepSearch />
      <Separator />
      <CollapsibleFileTree />
    </div>
  );
}
