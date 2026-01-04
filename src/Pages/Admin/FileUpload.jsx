import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

function FileUpload() {
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState(null);
  const form = useForm({
    defaultValues: {
      file: null,
      files: null,
    },
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  const handlePreview = (file) => {
    if (!file) {
      URL.revokeObjectURL(preview.imageUrl);
      form.setValue("file", null);
      setPreview(null);
      return;
    }
    if (preview) {
      URL.revokeObjectURL(preview.imageUrl);
    }
    const imageUrl = URL.createObjectURL(file);
    setPreview({ file, imageUrl });
    console.log(preview);
  };
  const handlePreviews = (files) => {
    const filesArray = Array.from(files);
    const combined = [];
    for (const file of filesArray) {
      if (combined.length >= 3) break;

      combined.push({ file, url: URL.createObjectURL(file) });
    }
    setPreviews(combined);
    form.setValue(
      "files",
      combined.map((image) => image.file),
      { shouldValidate: true }
    );
  };
  const removeImage = (index) => {
    const removed = previews[index];
    URL.revokeObjectURL(removed.url);
    const newArray = previews.filter((_, i) => i !== index);
    setPreviews(newArray);
    form.setValue(
      "files",
      newArray.map((img) => img.file)
    );
  };
  return (
    <div className="mt-20">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input
          type="file"
          {...form.register("file", {
            required: "File is required",
          })}
          onChange={(e) => handlePreview(e.target.files[0])}
        />
        {form.formState.errors.file && (
          <span className="text-red-600">
            {form.formState.errors.file.message}
          </span>
        )}
        {preview && (
          <div className="w-[200px]">
            <img src={preview?.imageUrl} />
            <button onClick={() => handlePreview(null)}>x</button>
          </div>
        )}
        <Controller
          name="files"
          control={form.control}
          rules={{ required: "files are required" }}
          render={({ field }) => (
            <input
              type="file"
              multiple
              onChange={(e) => field.onChange(()=>handlePreviews(e.target.files))}
            />
          )}
        />

        {form.formState.errors.files && (
          <span className="text-red-600">
            {form.formState.errors.files.message}
          </span>
        )}
        {previews &&
          previews.map((p, index) => (
            <div key={index} className="w-[200px]">
              <img src={p?.url} alt="image" />
              <button onClick={() => removeImage(index)}>x</button>
            </div>
          ))}
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
