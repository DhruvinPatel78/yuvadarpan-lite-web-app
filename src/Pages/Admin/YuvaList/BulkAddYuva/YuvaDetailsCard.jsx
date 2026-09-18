import React from "react";
import { Grid } from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CustomInput from "../../../../Component/Common/customInput";
import CustomRadio from "../../../../Component/Common/customRadio";
import CustomSelect from "../../../../Component/Common/customSelect";
import CustomCheckbox from "../../../../Component/Common/customCheckbox";
import DatePicker from "../../../../Component/Common/DatePicker";
import { Card, IconBtn } from "../../../../Component/UI";
import {
  activityList,
  bloodGroupList,
  educationList,
  getYuvaStatus,
  higherEducation,
  maritalStatusList,
} from "./formConfig";

const fieldError = (touched, errors, submitCount) =>
  (touched || submitCount > 0) && errors ? errors : "";

const YuvaDetailsCard = ({
  index,
  yuva,
  errors,
  touched,
  submitCount,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  canRemove,
  onRemove,
}) => {
  const prefix = `yuvas.${index}`;
  const yuvaErrors = Array.isArray(errors) ? errors[index] || {} : {};
  const yuvaTouched = Array.isArray(touched) ? touched[index] || {} : {};
  const status = getYuvaStatus(yuva);
  const statusClass =
    status === "Ready"
      ? "bg-primary/10 text-primary"
      : "bg-[#f4eee8] text-mutedText";

  const addOtherField = () => {
    const title = String(yuva?.otherDraft?.title || "").trim();
    const description = String(yuva?.otherDraft?.description || "").trim();
    if (!title || !description) {
      return;
    }
    setFieldValue(`${prefix}.otherList`, [
      ...(yuva.otherList || []),
      { title, description },
    ]);
    setFieldValue(`${prefix}.otherDraft`, { title: "", description: "" });
  };

  const removeOtherField = (fieldIndex) => {
    setFieldValue(
      `${prefix}.otherList`,
      (yuva.otherList || []).filter((_, i) => i !== fieldIndex)
    );
  };

  return (
    <Card id={`yuva-card-${index}`} className="w-full scroll-mt-24">
      <div className="flex items-start justify-between gap-3 mb-5 pb-3 border-b border-line">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-9 h-9 rounded-full border border-line text-primary text-sm font-WorkSemiBold flex items-center justify-center shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-WorkSemiBold text-primary leading-tight">
              Yuva details
            </h2>
            <p
              className={`inline-flex mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}`}
            >
              {status}
            </p>
          </div>
        </div>
        {canRemove ? (
          <IconBtn
            type="button"
            aria-label={`Remove Yuva ${index + 1}`}
            onClick={onRemove}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconBtn>
        ) : null}
      </div>
      <Grid container spacing={2}>
        <CustomInput
          type="text"
          label="Name"
          placeholder="Enter Your Name"
          name={`${prefix}.firstName`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.firstName,
            yuvaErrors?.firstName,
            submitCount
          )}
        />
        <CustomRadio
          list={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ]}
          label="Gender"
          name={`${prefix}.gender`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.gender}
          className="flex flex-row"
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.gender,
            yuvaErrors?.gender,
            submitCount
          )}
        />
        <DatePicker
          name={`${prefix}.dob`}
          xs={12}
          sm={6}
          md={4}
          placeholder="Date and Time of Birth"
          label="Date of birth"
          value={yuva?.dob}
          required={false}
          errors={fieldError(yuvaTouched?.dob, yuvaErrors?.dob, submitCount)}
          onBlur={() => setFieldTouched(`${prefix}.dob`, true)}
          onChange={(value) => {
            setFieldValue(`${prefix}.dob`, value);
            setFieldTouched(`${prefix}.dob`, true);
          }}
        />
        <CustomInput
          type="text"
          label="Birth Place"
          placeholder="Enter Your Birth Place"
          name={`${prefix}.pob`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.pob}
          required={false}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(yuvaTouched?.pob, yuvaErrors?.pob, submitCount)}
        />
        <CustomInput
          type="text"
          label="YSK No."
          placeholder="Enter Your YSK No."
          name={`${prefix}.YSKno`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.YSKno}
          required={false}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.YSKno,
            yuvaErrors?.YSKno,
            submitCount
          )}
        />
        <CustomSelect
          list={maritalStatusList}
          label="Marital Status"
          placeholder="Select Marital Status"
          name={`${prefix}.martialStatus`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.martialStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.martialStatus,
            yuvaErrors?.martialStatus,
            submitCount
          )}
        />
        <CustomInput
          type="text"
          label="Height (ft)"
          placeholder="Enter Your Height"
          name={`${prefix}.height`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.height}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.height,
            yuvaErrors?.height,
            submitCount
          )}
        />
        <CustomInput
          type="text"
          label="Weight (kg)"
          placeholder="Enter Your Weight"
          name={`${prefix}.weight`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.weight}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.weight,
            yuvaErrors?.weight,
            submitCount
          )}
        />
        <CustomSelect
          list={activityList}
          label="Activity"
          placeholder="Enter Your Activity"
          name={`${prefix}.activity`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.activity}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.activity,
            yuvaErrors?.activity,
            submitCount
          )}
        />
        <CustomSelect
          list={bloodGroupList}
          label="Blood Group"
          placeholder="Enter Your Blood Group"
          name={`${prefix}.bloodGroup`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.bloodGroup}
          required={false}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.bloodGroup,
            yuvaErrors?.bloodGroup,
            submitCount
          )}
        />
        <Grid item xs={12}>
          <p className="text-sm font-WorkSemiBold text-primary pt-1">
            Education
          </p>
        </Grid>
        <CustomSelect
          list={educationList}
          label="Highest Education"
          placeholder="Select Your Primary Education"
          name={`${prefix}.education.education`}
          xs={12}
          sm={6}
          md={4}
          value={yuva?.education?.education}
          errors={fieldError(
            yuvaTouched?.education?.education,
            yuvaErrors?.education?.education,
            submitCount
          )}
          onBlur={() => setFieldTouched(`${prefix}.education.education`, true)}
          onChange={(e) => {
            const education = e.target.value;
            setFieldValue(`${prefix}.education.education`, education);
            setFieldTouched(`${prefix}.education.education`, true);
            if (!higherEducation.includes(education)) {
              setFieldValue(`${prefix}.education.fieldOfStudy`, "");
            }
          }}
        />
        {higherEducation.includes(yuva?.education?.education) ? (
          <CustomInput
            type="text"
            label="Field of Study"
            placeholder="Enter Field of Study"
            name={`${prefix}.education.fieldOfStudy`}
            xs={12}
            sm={6}
            md={4}
            value={yuva?.education?.fieldOfStudy}
            onChange={handleChange}
            onBlur={handleBlur}
            errors={fieldError(
              yuvaTouched?.education?.fieldOfStudy,
              yuvaErrors?.education?.fieldOfStudy,
              submitCount
            )}
          />
        ) : null}
        <CustomCheckbox
          label="Handicap"
          name={`${prefix}.handicap`}
          xs={12}
          sm={12}
          md={12}
          value={yuva?.handicap}
          className="flex flex-row"
          onChange={(e) => {
            setFieldValue(`${prefix}.handicap`, e.target.checked);
            if (!e.target.checked) {
              setFieldValue(`${prefix}.handicapDetails`, "");
            }
          }}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.handicap,
            yuvaErrors?.handicap,
            submitCount
          )}
        />
        <CustomInput
          type="text"
          label="Handicap Details"
          placeholder="Enter Handicap Details"
          name={`${prefix}.handicapDetails`}
          multiline
          xs={12}
          sm={12}
          md={12}
          value={yuva?.handicapDetails}
          required={false}
          disabled={!yuva?.handicap}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={fieldError(
            yuvaTouched?.handicapDetails,
            yuvaErrors?.handicapDetails,
            submitCount
          )}
        />
        <Grid item xs={12}>
          <p className="text-sm font-WorkSemiBold text-primary pt-1">
            Other info
          </p>
        </Grid>
        {(yuva?.otherList || []).map((item, fieldIndex) => (
          <React.Fragment key={`${yuva.key}-other-${fieldIndex}`}>
            <CustomInput
              type="text"
              label="Title"
              placeholder="Enter Your Title"
              name={`${prefix}.otherList.${fieldIndex}.title`}
              xs={12}
              sm={5}
              value={item?.title}
              onChange={handleChange}
              required={false}
            />
            <CustomInput
              type="text"
              label="Description"
              placeholder="Enter Your Description"
              name={`${prefix}.otherList.${fieldIndex}.description`}
              xs={12}
              sm={6}
              value={item?.description}
              onChange={handleChange}
              required={false}
            />
            <Grid
              item
              xs={12}
              sm={1}
              className="flex justify-center sm:justify-end items-center"
            >
              <IconBtn
                type="button"
                aria-label="Remove field"
                onClick={() => removeOtherField(fieldIndex)}
              >
                <RemoveOutlinedIcon />
              </IconBtn>
            </Grid>
          </React.Fragment>
        ))}
        <CustomInput
          type="text"
          label="Title"
          placeholder="Enter Your Title"
          name={`${prefix}.otherDraft.title`}
          xs={12}
          sm={5}
          value={yuva?.otherDraft?.title}
          onChange={handleChange}
          required={false}
        />
        <CustomInput
          type="text"
          label="Description"
          placeholder="Enter Your Description"
          name={`${prefix}.otherDraft.description`}
          xs={12}
          sm={6}
          value={yuva?.otherDraft?.description}
          onChange={handleChange}
          required={false}
        />
        <Grid
          item
          xs={12}
          sm={1}
          className="flex justify-center sm:justify-end items-center"
        >
          <IconBtn type="button" aria-label="Add field" onClick={addOtherField}>
            <AddOutlinedIcon />
          </IconBtn>
        </Grid>
      </Grid>
    </Card>
  );
};

export default YuvaDetailsCard;