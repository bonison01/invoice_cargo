import { InvoiceData } from "@/pages/Index";

interface ReceiverFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const ReceiverForm = ({ data, updateData }: ReceiverFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Receiver Name</label>
        <input
          type="text"
          value={data.receiverName}
          onChange={(e) => updateData('receiverName', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Enter receiver name"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Contact Number</label>
        <input
          type="tel"
          value={data.receiverPhone}
          onChange={(e) => updateData('receiverPhone', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Phone number"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Address</label>
        <textarea
          rows={2}
          value={data.receiverAddress}
          onChange={(e) => updateData('receiverAddress', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
          placeholder="Enter receiver address"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Email (Optional)</label>
        <input
          type="email"
          value={data.receiverEmail}
          onChange={(e) => updateData('receiverEmail', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="email@example.com"
        />
      </div>
    </div>
  );
};
