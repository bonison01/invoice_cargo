import { InvoiceData } from "@/pages/Index";

interface SenderFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const SenderForm = ({ data, updateData }: SenderFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Sender Name</label>
        <input
          type="text"
          value={data.senderName}
          onChange={(e) => updateData('senderName', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Enter sender name"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Contact Number</label>
        <input
          type="tel"
          value={data.senderPhone}
          onChange={(e) => updateData('senderPhone', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Phone number"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Address</label>
        <textarea
          rows={2}
          value={data.senderAddress}
          onChange={(e) => updateData('senderAddress', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
          placeholder="Enter sender address"
        />
      </div>
    </div>
  );
};
