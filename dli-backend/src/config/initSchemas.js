const { usersSchema } = require('../modules/auth/auth.schema');
const { coursesSchema, dliCodesSchema } = require('../modules/courses/courses.schema');
const { tasksSchema, projectsSchema } = require('../modules/tasks/tasks.schema');
const { courseRequestsSchema } = require('../modules/requests/requests.schema');
const {
  auditLogsSchema,
  webhooksSchema,
  notificationsSchema
} = require('../modules/admin/admin.schema');

const collectionSchemas = [
  { name: 'users', schema: usersSchema },
  { name: 'courses', schema: coursesSchema },
  { name: 'dli_codes', schema: dliCodesSchema },
  { name: 'tasks', schema: tasksSchema },
  { name: 'projects', schema: projectsSchema },
  { name: 'courserequests', schema: courseRequestsSchema },
  { name: 'auditlogs', schema: auditLogsSchema },
  { name: 'webhooks', schema: webhooksSchema },
  { name: 'notifications', schema: notificationsSchema }
];

function buildValidator(schema) {
  return {
    validator: { $jsonSchema: schema },
    validationAction: 'error',
    validationLevel: 'strict'
  };
}

async function initializeSchemas(db) {
  for (const { name, schema } of collectionSchemas) {
    const validatorConfig = buildValidator(schema);

    try {
      await db.createCollection(name, validatorConfig);
      console.log(`[DB] Created collection "${name}" with validator`);
    } catch (error) {
      if (error.codeName !== 'NamespaceExists') {
        throw error;
      }

      await db.command({
        collMod: name,
        ...validatorConfig
      });
      console.log(`[DB] Updated validator for existing collection "${name}"`);
    }
  }
}

module.exports = { initializeSchemas, collectionSchemas };

if (require.main === module) {
  require('dotenv').config();

  const { connectDB, closeDB } = require('./db');

  connectDB()
    .then((db) => initializeSchemas(db))
    .then(() => {
      console.log('[DB] Schema initialization complete');
      return closeDB();
    })
    .catch(async (error) => {
      console.error('[DB] Schema initialization failed:', error.message);
      await closeDB();
      process.exit(1);
    });
}
