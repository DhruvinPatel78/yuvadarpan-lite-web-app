import React from "react";
import moment from "moment/moment";

export const getLookupName = (list, id, fallback = "") =>
  list?.find(
    (item) =>
      item?.id === id ||
      String(item?.id) === String(id) ||
      String(item?._id) === String(id)
  )?.name || fallback || "";

export const hasValue = (value) => {
  if (typeof value === "boolean") return true;
  if (value === 0 || value === "0") return true;
  return String(value ?? "").trim() !== "";
};

export const displayValue = (value, list) => {
  if (!hasValue(value)) return "";
  if (list) {
    const name = getLookupName(list, value);
    if (name) return name;
    if (/^[a-f0-9]{24}$/i.test(String(value))) return "";
  }
  return value;
};

export const extraOtherFields = (other) => {
  if (!other) return [];
  const source =
    typeof other.toObject === "function" ? other.toObject() : other;
  const toItem = (title, description) => ({
    title: String(title || "")
      .replace(/[_-]+/g, " ")
      .trim(),
    description: String(description ?? "").trim(),
  });
  if (Array.isArray(source)) {
    return source
      .map((item, index) =>
        toItem(item?.title || item?.label || `Item ${index + 1}`, item?.description ?? item?.value ?? "")
      )
      .filter((item) => hasValue(item.title) && hasValue(item.description));
  }
  if (typeof source !== "object") return [];
  return Object.entries(source)
    .filter(
      ([key, value]) =>
        key &&
        !key.startsWith("$") &&
        key !== "_id" &&
        key !== "__v" &&
        key !== "id" &&
        hasValue(value) &&
        typeof value !== "object"
    )
    .map(([key, value]) => toItem(key, value))
    .filter((item) => hasValue(item.title) && hasValue(item.description));
};

const fieldValue = (fields, label) =>
  (fields || []).find((field) => field.label === label)?.value || "";

const BiodataSection = ({ title, fields, caps = false }) => {
  const visibleFields = (fields || []).filter((field) => hasValue(field?.value));
  if (!visibleFields.length) return null;
  return (
    <div className="yuva-biodata-section">
      <h3 className={caps ? "is-caps" : ""}>{title}</h3>
      {visibleFields.map((field) => (
        <div className="yuva-biodata-row" key={field.label}>
          <span>{field.label}</span>
          <span>{field.value}</span>
        </div>
      ))}
    </div>
  );
};

const buildPrintModel = (data, lists) => {
  const { city, state, surname, country, region, district, samaj, nativeList } =
    lists;
  const labels = data?.labels || {};
  const fullName = [
    data?.firstName,
    data?.fatherName,
    getLookupName(surname, data?.lastName, labels.lastName),
  ]
    .filter(Boolean)
    .join(" ");

  const isFemale = String(data?.gender || "").toLowerCase() === "female";
  const showHandicap = data?.handicap === true;

  const additionalOther = extraOtherFields(data?.other);

  return {
    fullName,
    photo: data?.profile?.url,
    phone: data?.contactInfo?.phone,
    email: isFemale ? "" : data?.email,
    personal: [
      { label: "Name", value: fullName },
      {
        label: "Date of Birth",
        value: data?.dob ? moment(data.dob).format("D MMMM YYYY") : "",
      },
      { label: "Gender", value: data?.gender },
      { label: "Marital Status", value: data?.martialStatus },
      { label: "Place of Birth", value: data?.pob },
      { label: "Height", value: data?.height },
      { label: "Weight", value: data?.weight },
      { label: "Blood Group", value: data?.bloodGroup },
      { label: "Family ID", value: data?.familyId },
      { label: "YSK No", value: data?.YSKno },
    ],
    contact: [
      { label: "Phone", value: data?.contactInfo?.phone },
      ...(isFemale ? [] : [{ label: "Email", value: data?.email }]),
      { label: "Name", value: data?.contactInfo?.name },
      { label: "Relation", value: data?.contactInfo?.relation },
      { label: "Address", value: data?.address },
    ],
    family: [
      { label: "Father’s Name", value: data?.fatherName },
      { label: "Grand Father’s Name", value: data?.grandFatherName },
      { label: "Mother’s Name", value: data?.motherName },
    ],
    mama: [
      { label: "Name", value: data?.mamaInfo?.name },
      { label: "Native", value: data?.mamaInfo?.native },
      { label: "City", value: data?.mamaInfo?.city },
    ],
    education: [{ label: "Education", value: data?.education }],
    career: [
      { label: "Activity", value: data?.activity },
      { label: "Firm", value: data?.firm },
      { label: "Firm Address", value: data?.firmAddress },
    ],
    location: [
      { label: "Country", value: getLookupName(country, data?.country, labels.country) },
      { label: "State", value: getLookupName(state, data?.state, labels.state) },
      { label: "Region", value: getLookupName(region, data?.region, labels.region) },
      { label: "District", value: getLookupName(district, data?.district, labels.district) },
      { label: "City", value: getLookupName(city, data?.city, labels.city) },
      { label: "Native", value: getLookupName(nativeList, data?.native, labels.native) },
      { label: "Local Samaj", value: getLookupName(samaj, data?.localSamaj, labels.localSamaj) },
    ],
    other: [
      ...(showHandicap
        ? [
            { label: "Handicap", value: "Yes" },
            { label: "Handicap Details", value: data?.handicapDetails },
          ]
        : []),
      { label: "Manglik", value: data?.manglik === true ? "Yes" : "" },
    ],
    additional: additionalOther.flatMap((item, index) => [
      {
        label: additionalOther.length > 1 ? `Title ${index + 1}` : "Title",
        value: item.title,
      },
      {
        label:
          additionalOther.length > 1
            ? `Description ${index + 1}`
            : "Description",
        value: item.description,
      },
    ]),
  };
};

const TemplateTwo = ({ model }) => {
  const career = [
    { label: "Job", value: fieldValue(model.career, "Activity") },
    { label: "Company", value: fieldValue(model.career, "Firm") },
    { label: "Work Location", value: fieldValue(model.career, "Firm Address") },
  ];
  const contact = model.contact.filter((field) =>
    ["Phone", "Email", "Address"].includes(field.label)
  );

  return (
  <div className="yuva-print-sheet yuva-print-template-2 hidden">
    <div className="yuva-biodata">
      <div className="yuva-biodata-corner tl" />
      <div className="yuva-biodata-corner tr" />
      <div className="yuva-biodata-corner bl" />
      <div className="yuva-biodata-corner br" />
      <h1 className="yuva-biodata-title">Bio-Data</h1>
      <div className="yuva-biodata-body">
        <div className="yuva-biodata-left">
          {model.photo ? (
            <img
              src={model.photo}
              alt={model.fullName}
              className="yuva-biodata-photo"
            />
          ) : null}
          {model.fullName ? (
            <h2 className="yuva-biodata-name">{model.fullName}</h2>
          ) : null}
          <BiodataSection
            title="Personal Info"
            caps
            fields={model.personal}
          />
          <BiodataSection title="Contact Details" caps fields={contact} />
        </div>
        <div className="yuva-biodata-right">
          <BiodataSection title="Family Details" fields={model.family} />
          <BiodataSection title="Mama Info" fields={model.mama} />
          <BiodataSection
            title="Education"
            fields={[
              {
                label: "Highest Degree",
                value: fieldValue(model.education, "Education"),
              },
            ]}
          />
          <BiodataSection title="Career" fields={career} />
          <BiodataSection title="Location" fields={model.location} />
          <BiodataSection title="Other Info" fields={model.other} />
          <BiodataSection title="Additional Info" fields={model.additional} />
        </div>
      </div>
    </div>
  </div>
  );
};

const YuvaPrintTemplate = ({ data, lists }) => {
  const model = buildPrintModel(data, lists);
  return <TemplateTwo model={model} />;
};

export default YuvaPrintTemplate;
