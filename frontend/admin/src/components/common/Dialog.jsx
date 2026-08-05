import * as DialogPrimitive from "@radix-ui/react-dialog";

const AdminDialog = ({ open, onOpenChange, title, description, children }) => (
  <DialogPrimitive.Root open={open} onOpenChange={(isOpen) => onOpenChange?.(isOpen)}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 max-h-[90vh] w-[min(100%,56rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[28px] bg-white shadow-2xl focus:outline-none">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <DialogPrimitive.Title className="text-xl font-semibold text-slate-900">{title}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="text-sm text-slate-500">
                {description}
              </DialogPrimitive.Description>
            ) : null}
          </div>
          <DialogPrimitive.Close asChild>
            <button
              type="button"
              className="rounded-2xl px-3 py-2 text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </DialogPrimitive.Close>
        </div>
        <div className="max-h-[calc(90vh-4rem)] overflow-y-auto">{children}</div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>
);

export default AdminDialog;
