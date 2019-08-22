function getEnvOrFail(ENV: string): string {
  if (!process.env[ENV]) {
    throw new Error(`Please provide ${ENV} env variable`);
  }

  return process.env[ENV];
}

const emailerApiKey = getEnvOrFail('SENDGRID_API_KEY');
const emailFrom = getEnvOrFail('EMAIL_FROM');
const emailReceivers = getEnvOrFail('EMAIL_RECEIVERS').split(',');
const errorsReceiver = getEnvOrFail('ERRORS_RECEIVER');
const adsFile = getEnvOrFail('ADS_FILE');
const notBeforeDateTime = getEnvOrFail('NOT_BEFORE_DATE_TIME');

const njuskaloUrl = process.env.NJUSKALO_URL;
const plaviUrl = process.env.PLAVI_URL;
const indexUrl = process.env.INDEX_URL;

export const config = {
  emailFrom,
  emailReceivers,
  errorsReceiver,
  emailerApiKey,
  adsFile,
  notBeforeDateTime,
  njuskaloUrl,
  plaviUrl,
  indexUrl,
}
