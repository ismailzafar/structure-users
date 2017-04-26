export default {
  tables: [
    {
      action: 'create',
      table: 'users',
      indexes: [
        'email',
        'firstName',
        'lastName',
        'status',
        'username'
      ],
      compoundIndexes: [
        {
          name: 'fullName',
          indexes: ['firstName', 'lastName']
        }
      ]
    },
    {
      action: 'create',
      table: 'applications',
      indexes: [
        {
          name: 'hostnames',
          multi: true
        },
        'organizationId'
      ]
    },
    {
      action: 'create',
      table: 'link_users_documents',
      indexes: [
        'userId',
        'documentId'
      ],
      compoundIndexes: [
        {
          name: 'link_user_document',
          indexes: ['userId', 'documentId']
        }
      ]
    },
    {
      action: 'create',
      table: 'link_users_document_revisions',
      indexes: [
        'userId',
        'documentRevisionId'
      ],
      compoundIndexes: [
        {
          name: 'link_user_document_revision',
          indexes: ['userId', 'documentRevisionId']
        }
      ]
    },
    {
      action: 'create',
      table: 'link_users_templates',
      indexes: [
        'userId',
        'templateId'
      ],
      compoundIndexes: [
        {
          name: 'link_user_template',
          indexes: ['userId', 'templateId']
        }
      ]
    },
    {
      action: 'create',
      table: 'link_users_template_revisions',
      indexes: [
        'userId',
        'templateRevisionId'
      ],
      compoundIndexes: [
        {
          name: 'link_user_template_revision',
          indexes: ['userId', 'templateRevisionId']
        }
      ]
    },
  ]
}
