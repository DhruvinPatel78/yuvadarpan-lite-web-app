import React from "react";
import moment from "moment/moment";
import { getUserImageSrc } from "../../util/defaultUserImage";
import { asDisplayText, langText, masterNameText, pickOtherMap } from "../../util/bhasha";
import { tForm } from "../../i18n/yuvaForm";

export const getLookupName = (list, id, fallback = "", lang = "en") => {
  if (id == null || id === "") return langText(fallback, lang) || "";
  const key = String(id);
  const found = (list || []).find((item) =>
    [item?.id, item?.value, item?._id, item?.uuid].some(
      (value) => value != null && String(value) === key
    )
  );
  return masterNameText(found, lang) || langText(fallback, lang) || "";
};

export const hasValue = (value) => {
  if (typeof value === "boolean") return true;
  if (value === 0 || value === "0") return true;
  if (value && typeof value === "object") return Boolean(langText(value));
  return String(value ?? "").trim() !== "";
};

export const displayValue = (value, list) => {
  if (!hasValue(value)) return "";
  if (list) {
    const name = getLookupName(list, value);
    if (name) return name;
    if (/^[a-f0-9]{24}$/i.test(String(value))) return "";
  }
  return asDisplayText(value);
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

const fieldValue = (fields, key) =>
  (fields || []).find((field) => field.key === key)?.value || "";

const codedText = (value, prefix, lang) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return langText(value, lang);
  }
  const code = String(value || "").trim();
  if (!code) return "";
  if (prefix) {
    const keyed = tForm(lang, `${prefix}.${code}`);
    if (keyed !== `${prefix}.${code}`) return keyed;
  }
  return code;
};

const BiodataSection = ({ title, fields, caps = false }) => {
  const visibleFields = (fields || []).filter((field) => hasValue(field?.value));
  if (!visibleFields.length) return null;
  return (
    <div className="yuva-biodata-section">
      <h3 className={caps ? "is-caps" : ""}>{title}</h3>
      {visibleFields.map((field, index) => (
        <div className="yuva-biodata-row" key={`${field.label}-${index}`}>
          <span>{field.label}</span>
          <span>{asDisplayText(field.value)}</span>
        </div>
      ))}
    </div>
  );
};

const buildPrintModel = (data, lists, lang = "en") => {
  const { city, state, surname, country, region, district, samaj, nativeList } =
    lists;
  const labels = data?.labels || {};
  const t = (key) => tForm(lang, key);
  const lookup = (list, id, fallback) =>
    getLookupName(list, id, fallback, lang);
  const fullName = [
    langText(data?.firstName, lang),
    langText(data?.fatherName, lang),
    lookup(surname, data?.lastName, labels.lastName),
  ]
    .filter(Boolean)
    .join(" ");

  const showHandicap = data?.handicap === true;
  const additionalOther = extraOtherFields(pickOtherMap(data, lang));
  const yesNo = (value) => (value === true ? t("yes") : "");

  return {
    fullName,
    photo: getUserImageSrc(data?.profile?.url),
    phone: data?.contactInfo?.phone,
    personal: [
      { key: "firstName", label: t("firstName"), value: fullName },
      {
        key: "dob",
        label: t("dob"),
        value: data?.dob
          ? moment(data.dob).format(lang === "gu" ? "DD/MM/YYYY" : "D MMMM YYYY")
          : "",
      },
      { key: "gender", label: t("gender"), value: langText(data?.gender, lang) },
      {
        key: "martialStatus",
        label: t("maritalStatus"),
        value: langText(data?.martialStatus, lang),
      },
      { key: "pob", label: t("pob"), value: langText(data?.pob, lang) },
      { key: "height", label: t("height"), value: data?.height },
      { key: "weight", label: t("weight"), value: data?.weight },
      { key: "bloodGroup", label: t("bloodGroup"), value: data?.bloodGroup },
      { key: "familyId", label: t("familyId"), value: data?.familyId },
      { key: "yskNo", label: t("yskNo"), value: data?.YSKno },
    ],
    contact: [
      { key: "phone", label: t("phone"), value: data?.contactInfo?.phone },
      {
        key: "contactName",
        label: t("firstName"),
        value: langText(data?.contactInfo?.name, lang),
      },
      {
        key: "contactLastName",
        label: t("lastName"),
        value: lookup(
          surname,
          data?.contactInfo?.lastName,
          labels.contactLastName
        ),
      },
      {
        key: "relation",
        label: t("relation"),
        value: codedText(data?.contactInfo?.relation, "relation", lang),
      },
      { key: "address", label: t("address"), value: langText(data?.address, lang) },
    ],
    family: [
      { key: "fatherName", label: t("fatherName"), value: langText(data?.fatherName, lang) },
      {
        key: "grandFatherName",
        label: t("grandFatherName"),
        value: langText(data?.grandFatherName, lang),
      },
      { key: "motherName", label: t("motherName"), value: langText(data?.motherName, lang) },
    ],
    mama: [
      { key: "mamaName", label: t("firstName"), value: langText(data?.mamaInfo?.name, lang) },
      {
        key: "mamaLastName",
        label: t("lastName"),
        value: lookup(surname, data?.mamaInfo?.lastName, labels.mamaLastName),
      },
      {
        key: "mamaNative",
        label: t("native"),
        value: lookup(nativeList, data?.mamaInfo?.native, labels.mamaNative),
      },
      { key: "mamaCity", label: t("city"), value: langText(data?.mamaInfo?.city, lang) },
    ],
    education: [
      {
        key: "education",
        label: t("education"),
        value: codedText(
          data?.education?.education || data?.education,
          "education",
          lang
        ),
      },
      {
        key: "fieldOfStudy",
        label: t("fieldOfStudy"),
        value: data?.education?.fieldOfStudy || data?.fieldOfStudy,
      },
    ],
    career: [
      { key: "activity", label: t("activity"), value: langText(data?.activity, lang) },
      { key: "firm", label: t("firm"), value: langText(data?.firm, lang) },
      {
        key: "firmAddress",
        label: t("firmAddress"),
        value: langText(data?.firmAddress, lang),
      },
    ],
    location: [
      { key: "country", label: t("country"), value: lookup(country, data?.country, labels.country) },
      { key: "state", label: t("state"), value: lookup(state, data?.state, labels.state) },
      { key: "region", label: t("region"), value: lookup(region, data?.region, labels.region) },
      { key: "district", label: t("district"), value: lookup(district, data?.district, labels.district) },
      { key: "city", label: t("city"), value: lookup(city, data?.city, labels.city) },
      { key: "native", label: t("native"), value: lookup(nativeList, data?.native, labels.native) },
      { key: "localSamaj", label: t("localSamaj"), value: lookup(samaj, data?.localSamaj, labels.localSamaj) },
    ],
    other: [
      ...(showHandicap
        ? [
            { key: "handicap", label: t("handicap"), value: yesNo(true) },
            {
              key: "handicapDetails",
              label: t("handicapDetails"),
              value: langText(data?.handicapDetails, lang),
            },
          ]
        : []),
      { key: "manglik", label: t("manglik"), value: yesNo(data?.manglik === true) },
    ],
    additional: additionalOther.map((item) => ({
      label: item.title,
      value: item.description,
    })),
    titles: {
      biodata: t("biodata"),
      personalInfo: t("personalInfo"),
      contactDetails: t("contactDetails"),
      familyDetails: t("familyDetails"),
      mamaInfo: t("mamaInfo"),
      education: t("education"),
      career: t("career"),
      location: t("location"),
      otherInfo: t("otherInfo"),
      additionalInfo: t("additionalInfo"),
      job: t("job"),
      company: t("company"),
      workLocation: t("workLocation"),
      highestDegree: t("highestDegree"),
    },
  };
};

const TemplateTwo = ({ model }) => {
  const titles = model.titles || {};
  const career = [
    { label: titles.job, value: fieldValue(model.career, "activity") },
    { label: titles.company, value: fieldValue(model.career, "firm") },
    { label: titles.workLocation, value: fieldValue(model.career, "firmAddress") },
  ];
  const contact = model.contact.filter((field) =>
    ["phone", "address"].includes(field.key)
  );

  return (
  <div className="yuva-print-sheet yuva-print-template-2 hidden">
    <div className="yuva-biodata">
      <div className="yuva-biodata-corner tl" />
      <div className="yuva-biodata-corner tr" />
      <div className="yuva-biodata-corner bl" />
      <div className="yuva-biodata-corner br" />
      <h1 className="yuva-biodata-title">{titles.biodata}</h1>
      <div className="yuva-biodata-body">
        <div className="yuva-biodata-left">
          <img
            src={model.photo}
            alt={model.fullName || titles.biodata}
            className="yuva-biodata-photo"
          />
          {model.fullName ? (
            <h2 className="yuva-biodata-name">{model.fullName}</h2>
          ) : null}
          <BiodataSection
            title={titles.personalInfo}
            caps
            fields={model.personal}
          />
          <BiodataSection title={titles.contactDetails} caps fields={contact} />
        </div>
        <div className="yuva-biodata-right">
          <BiodataSection title={titles.familyDetails} fields={model.family} />
          <BiodataSection title={titles.mamaInfo} fields={model.mama} />
          <BiodataSection
            title={titles.education}
            fields={[
              {
                label: titles.highestDegree,
                value: fieldValue(model.education, "education"),
              },
            ]}
          />
          <BiodataSection title={titles.career} fields={career} />
          <BiodataSection title={titles.location} fields={model.location} />
          <BiodataSection title={titles.otherInfo} fields={model.other} />
          <BiodataSection title={titles.additionalInfo} fields={model.additional} />
        </div>
      </div>
    </div>
  </div>
  );
};

const YuvaPrintTemplate = ({ data, lists, language = "en" }) => {
  const model = buildPrintModel(data, lists, language);
  return <TemplateTwo model={model} />;
};

export default YuvaPrintTemplate;
