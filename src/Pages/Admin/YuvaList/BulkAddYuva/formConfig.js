import * as Yup from "yup";
import dayjs from "dayjs";

const slugPart = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9]/g, "") || "na";

export const buildYuvaPhotoName = (yuva) =>
  `yuva_${slugPart(yuva?.firstName)}_${slugPart(yuva?.fatherName)}_${slugPart(
    yuva?.grandFatherName
  )}_${slugPart(yuva?.familyId)}_${
    yuva?.dob && dayjs(yuva.dob).isValid()
      ? dayjs(yuva.dob).format("DDMMYYYY")
      : "na"
  }`;

export const higherEducation = [
  "Diploma",
  "Graduate",
  "Post Graduate",
  "PHD",
  "OTHER",
];

export const maritalStatusList = [
  "divorce",
  "engaged",
  "married",
  "seprated",
  "single",
  "widow",
  "widower",
];

export const activityList = [
  "abroad",
  "business",
  "child",
  "farming",
  "house hold",
  "house wife",
  "job seeker",
  "job/service",
  "retired",
  "self employed",
  "study",
];

export const bloodGroupList = [
  "NOT KNOWN",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export const educationList = [
  "1st std",
  "2nd std",
  "3rd std",
  "4th std",
  "5th std",
  "6th std",
  "7th std",
  "8th std",
  "9th std",
  "10th std (SSC)",
  "11th std",
  "12th std (HSC)",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "PHD",
  "OTHER",
];

export const relationList = [
  "Grandfather",
  "Grandmother",
  "Father",
  "Mother",
  "Uncle",
  "Aunty",
  "Brother",
  "Sister",
  "Fai",
  "Fuva",
  "Mama",
  "Mami",
  "Masa",
  "Masi",
  "Guardian",
];

export const fieldsToOtherObject = (list = [], draft) => {
  const rows = [...list];
  const draftTitle = String(draft?.title || "").trim();
  const draftDescription = String(draft?.description || "").trim();
  if (draftTitle && draftDescription) {
    rows.push({ title: draftTitle, description: draftDescription });
  }
  return rows.reduce((acc, item) => {
    const title = String(item?.title || "").trim();
    const description = String(item?.description || "").trim();
    if (title && description) {
      acc[title.replace(/\s+/g, "_")] = description;
    }
    return acc;
  }, {});
};

const hasText = (value) => String(value ?? "").trim() !== "";

let yuvaSeq = 0;

export const createYuva = () => ({
  key: `yuva-${Date.now()}-${Math.random().toString(36).slice(2, 9)}-${yuvaSeq++}`,
  firstName: "",
  gender: "male",
  dob: null,
  pob: "",
  YSKno: "",
  martialStatus: "",
  height: "",
  weight: "",
  activity: "",
  bloodGroup: "",
  education: {
    education: "",
    fieldOfStudy: "",
  },
  handicap: false,
  handicapDetails: "",
  abroadStudy: "no",
  otherList: [],
  otherDraft: {
    title: "",
    description: "",
  },
});

export const familyInitialValues = {
  fatherName: "",
  grandFatherName: "",
  lastName: "",
  motherName: "",
  familyId: "",
  native: "",
  firm: "",
  country: "",
  state: "",
  region: "",
  district: "",
  city: "",
  localSamaj: "",
  address: "",
  firmAddress: "",
  mamaInfo: {
    name: "",
    lastName: "",
    city: "",
    native: "",
  },
  contactInfo: {
    name: "",
    lastName: "",
    phone: "",
    relation: "",
  },
};

export const yuvaHasContent = (yuva) => {
  if (!yuva) return false;
  if (hasText(yuva.firstName)) return true;
  if (hasText(yuva.pob)) return true;
  if (hasText(yuva.YSKno)) return true;
  if (hasText(yuva.martialStatus)) return true;
  if (hasText(yuva.height)) return true;
  if (hasText(yuva.weight)) return true;
  if (hasText(yuva.activity)) return true;
  if (hasText(yuva.bloodGroup)) return true;
  if (hasText(yuva.education?.education)) return true;
  if (hasText(yuva.education?.fieldOfStudy)) return true;
  if (hasText(yuva.handicapDetails)) return true;
  if (yuva.handicap) return true;
  if (yuva.dob && dayjs(yuva.dob).isValid()) return true;
  if (
    (yuva.otherList || []).some(
      (item) => hasText(item?.title) || hasText(item?.description)
    )
  ) {
    return true;
  }
  if (hasText(yuva.otherDraft?.title) || hasText(yuva.otherDraft?.description)) {
    return true;
  }
  return false;
};

export const getYuvaStatus = (yuva) => {
  if (!yuvaHasContent(yuva)) {
    return "Not started";
  }
  const requiredFilled =
    hasText(yuva.firstName) &&
    hasText(yuva.gender) &&
    yuva.dob &&
    dayjs(yuva.dob).isValid() &&
    hasText(yuva.martialStatus) &&
    hasText(yuva.height) &&
    hasText(yuva.weight) &&
    hasText(yuva.activity) &&
    hasText(yuva.bloodGroup) &&
    hasText(yuva.education?.education) &&
    (!higherEducation.includes(yuva.education?.education) ||
      hasText(yuva.education?.fieldOfStudy)) &&
    (!yuva.handicap || hasText(yuva.handicapDetails));
  return requiredFilled ? "Ready" : "In progress";
};

const yuvaSchema = Yup.object({
  firstName: Yup.string().required("First Name Is Required"),
  gender: Yup.string().required("Gender Is Required"),
  pob: Yup.string(),
  dob: Yup.mixed()
    .nullable()
    .test(
      "dob",
      "Date Of Birth Is Required",
      (value) => Boolean(value) && dayjs(value).isValid()
    ),
  height: Yup.string().required("Height Is Required"),
  weight: Yup.string().required("Weight Is Required"),
  education: Yup.object({
    education: Yup.string().required("Education Is Required"),
    fieldOfStudy: Yup.string().when("education", {
      is: (value) => higherEducation.includes(value),
      then: (schema) => schema.required("Field of Study Is Required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  bloodGroup: Yup.string().required("Blood Group Is Required"),
  activity: Yup.string().required("Activity Is Required"),
  martialStatus: Yup.string().required("Martial Status Is Required"),
  handicapDetails: Yup.string().when("handicap", {
    is: true,
    then: (schema) => schema.required("Handicap Details Is Required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  YSKno: Yup.string(),
});

export const bulkAddValidationSchema = Yup.object({
  fatherName: Yup.string().required("Father Name Is Required"),
  grandFatherName: Yup.string().required("Grand Father Name Is Required"),
  lastName: Yup.string().required("Last Name Is Required"),
  motherName: Yup.string().required("Mother Name Is Required"),
  familyId: Yup.number()
    .typeError("Must be a Number")
    .positive()
    .required("Family ID IsRequired"),
  native: Yup.string().required("Native Is Required"),
  firm: Yup.string().required("Firm Is Required"),
  country: Yup.string().required("Country Is Required"),
  state: Yup.string().required("State Is Required"),
  region: Yup.string().required("Region Is Required"),
  district: Yup.string().required("District Is Required"),
  city: Yup.string().required("City Is Required"),
  localSamaj: Yup.string().required("Local Samaj Required"),
  address: Yup.string().required("Address Is Required"),
  firmAddress: Yup.string().required("Firm Address Is Required"),
  mamaInfo: Yup.object({
    name: Yup.string().required("Mama Name Is Required"),
    lastName: Yup.string().required("Mama Last Name Is Required"),
    native: Yup.string().required("Mama Native Is Required"),
    city: Yup.string().required("Mama City Is Required"),
  }),
  contactInfo: Yup.object({
    name: Yup.string().required("Contact Name Is Required"),
    lastName: Yup.string().required("Contact Last Name Is Required"),
    relation: Yup.string().required("Contact Relation Is Required"),
    phone: Yup.string()
      .matches("^(\\+\\d{1,3}[- ]?)?\\d{10}$", "Enter a valid phone number")
      .required("Contact Phone Number Is Required"),
  }),
  yuvas: Yup.array()
    .of(
      Yup.lazy((value, options) => {
        const parent = options.parent;
        const list = Array.isArray(parent)
          ? parent
          : Array.isArray(parent?.yuvas)
            ? parent.yuvas
            : [];
        const index =
          typeof options.index === "number"
            ? options.index
            : list.findIndex((item) => item === value);
        const anyFilled = list.some(yuvaHasContent);
        if (!yuvaHasContent(value) && (anyFilled || index > 0)) {
          return Yup.mixed().notRequired();
        }
        return yuvaSchema;
      })
    )
    .test("at-least-one", "Add at least one Yuva", (arr) =>
      (arr || []).some(yuvaHasContent)
    ),
});

const FAMILY_KEYS = [
  "fatherName",
  "grandFatherName",
  "lastName",
  "motherName",
  "familyId",
  "native",
  "firm",
  "country",
  "state",
  "region",
  "district",
  "city",
  "localSamaj",
  "address",
  "firmAddress",
  "mamaInfo",
  "contactInfo",
];

export const buildBulkPayload = (values) => {
  const family = FAMILY_KEYS.reduce((acc, key) => {
    acc[key] = values[key];
    return acc;
  }, {});
  const filled = (values.yuvas || []).filter(yuvaHasContent);
  return filled.map((yuva) => {
    const { key, otherList, otherDraft, ...yuvaFields } = yuva;
    delete yuvaFields.email;
    return {
      ...family,
      ...yuvaFields,
      other: fieldsToOtherObject(otherList, otherDraft),
      abroadStudy: yuva.abroadStudy || "no",
    };
  });
};
