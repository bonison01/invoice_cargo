import { InvoiceData } from "@/pages/Index";

interface CompanyFormProps {
  data: InvoiceData;
  updateData: (field: keyof InvoiceData, value: any) => void;
}

export const CompanyForm = ({ data, updateData }: CompanyFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-2">Company Name</label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => updateData('companyName', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background"
          placeholder="Enter company name"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-2">Address</label>
        <textarea
          rows={2}
          value={data.companyAddress}
          onChange={(e) => updateData('companyAddress', e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background resize-none"
          placeholder="Enter company address"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Phone</label>
          <input
            type="tel"
            value={data.companyPhone}
            onChange={(e) => updateData('companyPhone', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="Phone number"
          />
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Email (Optional)</label>
          <input
            type="email"
            value={data.companyEmail}
            onChange={(e) => updateData('companyEmail', e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background"
            placeholder="email@example.com"
          />
        </div>
      </div>
    </div>
  );
};
