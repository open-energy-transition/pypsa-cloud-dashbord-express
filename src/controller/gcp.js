const Jobs = require("../models/Jobs");

const bucket = gcp_storage.bucket(process.env.STORAGE_BUCKET || "payment-dashboard");

async function updateVersion(job_id, version) {
  const job_id = job_id;
  const version = req.body.pypsa_ver;
  const job = await Jobs.findOneAndUpdate(
    { _id: job_id },
    { $set: { pypsa_version: version } },
    { new: true }
  );
  console.log("change ver ", req.body);
  return job;
}

const uploadFile = (buffer, file_name) =>
  new Promise((resolve, reject) => {

    const filepath = `${user.id}/${order_id}/configs/${file_name}.yaml`;
    const blob = bucket.file(filepath);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });
    blobStream
      .on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      })
      .on("error", (error) => {
        reject(error);
      })
      .end(buffer);
  });

async function updatefileUploadStatus(job_id, file_name) {
  await Jobs.updateOne({ _id: job_id }, { $set: { [file_name]: true } });
  const jobObj = await Jobs.findById(job_id);
  if (
    jobObj.config === true &&
    jobObj.bundle_config === true &&
    jobObj.powerplantmatching_config === true
  ) {
    const x = await Jobs.updateOne(
      { _id: new ObjectId(job_id) },
      { $set: { status: "pending" } },
      { new: true }
    );
    console.log("status all file", x);
  }
}

async function copyDefaultConfig(user_id, order_id, file_name) {
  // The ID of the GCS file to copy
  const srcFilename = `default-configs/${file_name}.yaml`;

  // The ID of the GCS file to create

  const destFileName = `${user_id}/${order_id}/configs/${file_name}.yaml`;

  const copyDestination = bucket.file(destFileName);

  const copyOptions = {
    preconditionOpts: {
      ifGenerationMatch: 0,
    },
  };

  // Copies the file to the other bucket
  const upload_result = await bucket
    .file(srcFilename)
    .copy(copyDestination, copyOptions);

  console.log("default upload", upload_result[1].done);

  return upload_result[1];
}


module.exports = {
    updateVersion,
    uploadFile,
    updatefileUploadStatus,
    copyDefaultConfig
}
