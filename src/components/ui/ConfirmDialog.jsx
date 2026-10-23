import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={"sm"}
      footer={
        <>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={isDestructive ? "danger" : "primary"}
            size={"sm"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {
        <div className={"flex items-start gap-3"}>
          {isDestructive && (
            <div
              className={
                "w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0"
              }
            >
              {<AlertTriangle className={"w-5 h-5"} />}
            </div>
          )}
          {
            <p className={"text-sm text-slate-600 leading-relaxed"}>
              {message}
            </p>
          }
        </div>
      }
    </Modal>
  );
};
export { ConfirmDialog };
