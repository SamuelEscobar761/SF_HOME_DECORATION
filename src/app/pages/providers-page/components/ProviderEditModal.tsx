import { useEffect, useState } from "react";
import { Provider } from "../../../classes/Provider";

interface ProviderEditModalProps {
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ProviderEditModal: React.FC<ProviderEditModalProps> = ({
  provider,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [form, setForm] = useState({
    name: provider.getName(),
    contactName: provider.getContactName(),
    contactLastname: provider.getContactLastname(),
    contactPhone: provider.getContactPhone(),
    contactEmail: provider.getContactEmail(),
    address: provider.getAddress(),
    phone: provider.getPhone(),
    image: provider.getImage(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: provider.getName(),
        contactName: provider.getContactName(),
        contactLastname: provider.getContactLastname(),
        contactPhone: provider.getContactPhone(),
        contactEmail: provider.getContactEmail(),
        address: provider.getAddress(),
        phone: provider.getPhone(),
        image: provider.getImage(),
      });
      setImageFile(null);
    }
  }, [isOpen, provider]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setForm((f) => ({
      ...f,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSave = async () => {
    provider.setName(form.name);
    provider.setContactName(form.contactName);
    provider.setContactLastname(form.contactLastname);
    provider.setContactPhone(form.contactPhone);
    provider.setContactEmail(form.contactEmail);
    provider.setAddress(form.address);
    provider.setPhone(form.phone);
    const ok = await provider.update(imageFile);
    if (ok) {
      onClose();
      onSaved();
    } else {
      console.error("No se pudo actualizar el provider");
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl mx-auto relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl mb-4">Editar Proveedor</h2>

        <div className="mb-4">
          <label className="block mb-1">Imagen</label>
          <div
            className="min-h-80 h-auto w-full flex justify-center items-center rounded bg-neutral-100 flex-shrink-0 object-contain mb-2 cursor-pointer overflow-hidden"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {form.image ? (
              <img
                src={form.image}
                alt="Preview"
                className="object-contain h-full w-full"
              />
            ) : (
              <span className="text-7xl text-neutral-500">+</span>
            )}
          </div>
          <input
            type="file"
            id="file-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {(
            [
              ["name", "Nombre de la empresa"],
              ["contactName", "Nombre de contacto"],
              ["contactLastname", "Apellido de contacto"],
              ["contactPhone", "Teléfono de contacto"],
              ["contactEmail", "Email de contacto"],
              ["address", "Dirección"],
              ["phone", "Teléfono"],
            ] as [keyof typeof form, string][]
          ).map(([field, label]) => (
            <div key={field}>
              <label className="block mb-1">{label}</label>
              <input
                type="text"
                value={form[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
