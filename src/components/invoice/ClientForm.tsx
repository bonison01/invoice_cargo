import { InvoiceData } from "@/pages/Index";

interface ClientFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const ClientForm = ({ data, updateData }: ClientFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Client Name</label>
        <input
          type="text"
          value={data.clientName}
          onChange={(e) => updateData('clientName', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Enter client name"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Address</label>
        <textarea
          rows={2}
          value={data.clientAddress}
          onChange={(e) => updateData('clientAddress', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
          placeholder="Enter client address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Phone</label>
          <input
            type="tel"
            value={data.clientPhone}
            onChange={(e) => updateData('clientPhone', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Email (Optional)</label>
          <input
            type="email"
            value={data.clientEmail}
            onChange={(e) => updateData('clientEmail', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="email@example.com"
          />
        </div>
      </div>
    </div>
  );
};
