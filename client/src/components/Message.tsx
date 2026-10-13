import { CheckCircle2, XCircle } from 'lucide-react';

export type MessageType = 'success' | 'error';

interface MessageProps {
  type: MessageType;
  text: string;
}

/** 操作结果提示条:区分成功(绿)/失败(红) */
export default function Message({ type, text }: MessageProps) {
  if (!text) return null;
  const isSuccess = type === 'success';
  return (
    <div
      className={`flex animate-fade-in-up items-center gap-2 rounded-lg px-4 py-3 text-sm ${
        isSuccess ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {isSuccess ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
      <span>{text}</span>
    </div>
  );
}
