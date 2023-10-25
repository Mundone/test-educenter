const swaggerJSDoc = require('swagger-jsdoc');

// Options for the swagger docs
const options = {
    definition: {
      openapi: '3.0.0', // or your OpenAPI version
      info: {
        title: 'EDU SYSTEM API',
        version: '1.0.0',
        description: 'API for EDU SYSTEM',
        // additional info fields
      },
      components: {
        schemas: {
          Announcement: {
            type: 'object',
            required: ['educationCenterId', 'title', 'content'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the Announcement.',
              },
              educationCenterId: {
                type: 'integer',
                description: 'The foreign key for the Announcement that the Announcement is part of.'
              },
              title: {
                type: 'string',
                description: 'title of the Announcement.',
              },
              content: {
                type: 'string',
                description: 'content of the Announcement.',
              },
            },
            example: {
              id: 1,
              educationCenterId: 1,
              title: 'Test Announcement',
              content: 'Test content',
              image: "Test.png",
            },
          },
          Branch: {
            type: 'object',
            required: ['educationCenterId', 'name', 'subdistrictId'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the branch.',
              },
              educationCenterId: {
                type: 'integer',
                description: 'The foreign key for the branch that the branch is part of.'
              },
              name: {
                type: 'string',
                description: 'Name of the branch.',
              },
              subdistrictId: {
                type: 'integer',
                description: 'The foreign key for the branch that the branch is part of.'
              },
              otherDescription: {
                type: 'string',
                description: 'Description of the branch.',
              },
              latitude: {
                type: 'double',
                description: 'latitude of the branch.',
              },
              longitude: {
                type: 'double',
                description: 'longitude of the branch.',
              },
              image: {
                type: 'string',
                description: 'Image of the branch.',
              },
            },
            example: {
              id: 1,
              educationCenterId: 1,
              name: 'Test Education Center',
              subdistrictId: 1,
              otherDescription: 'Test description',
              latitude: 1,
              longitude: 1,
              image: "Test.png",
            },
          },
          City: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the city.',
              },
              name: {
                type: 'string',
                description: 'Name of the city.',
              },
            },
            example: {
              id: 1,
              name: 'Test city',
            },
          },
          Contract: {
            type: 'object',
            required: ['userId', 'courseId', 'content'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the Contract.',
              },
              userId: {
                type: 'integer',
                description: 'The foreign key for the Contract that the Contract is part of.'
              },
              courseId: {
                type: 'integer',
                description: 'The foreign key for the Contract that the Contract is part of.'
              },
              content: {
                type: 'string',
                description: 'content of the Contract.',
              },
              status: {
                type: 'string',
                description: 'status of the Contract.',
              },
            },
            example: {
              id: 1,
              userId: 1,
              courseId: 1,
              content: "Test content",
              status: 'Test status',
            },
          },
          Course: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the Course.',
              },
              branchId: {
                type: 'integer',
                description: 'The foreign key for the Course that the Course is part of.'
              },
              name: {
                type: 'string',
                description: 'Name of the Course.',
              },
              description: {
                type: 'string',
                description: 'description of the Course.',
              },
              startDate: {
                type: 'date',
                description: 'startDate of the Course.',
              },
              endDate: {
                type: 'date',
                description: 'endDate of the Course.',
              },
              enrollmentStartDate: {
                type: 'date',
                description: 'enrollmentStartDate of the Course.',
              },
              enrollmentEndDate: {
                type: 'date',
                description: 'enrollmentEndDate of the Course.',
              },
              maxStudents: {
                type: 'integer',
                description: 'maxStudents of the Course.',
              },
              currentStudents: {
                type: 'integer',
                description: 'currentStudents of the Course.',
              },
              image: {
                type: 'string',
                description: 'image of the Course.',
              },
            },
            example: {
              id: 1,
              name: 'Test city',
              description: 'Test description',
              startDate: '2023-10-24 19:09',
              endDate: '2023-10-24 19:09',
              enrollmentStartDate: '2023-10-24 19:09',
              enrollmentEndDate: '2023-10-24 19:09',
              maxStudents: 10,
              currentStudents: 7,
              image: "Test.png",
            },
          },
          CourseTag: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the CourseTag.',
              },
              tagName: {
                type: 'string',
                description: 'Name of the CourseTag.',
              },
            },
            example: {
              id: 1,
              tagName: 'Test tagName',
            },
          },
          CourseTagMapping: {
            type: 'object',
            description: 'Associative entity mapping courses and their respective tags.', 
            required: ['courseId', 'tagId'], // assuming these are required during creation in your use case
            properties: {
              courseId: {
                type: 'integer',
                description: 'Unique identifier of the course.',
                example: 12345, // an example courseId
              },
              tagId: {
                type: 'integer',
                description: 'Unique identifier of the associated tag.',
                example: 67890, // an example tagId
              },
            },
          },
          District: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the district.',
              },
              cityId: {
                type: 'integer',
                description: 'The foreign key for the district that the district is part of.'
              },
              name: {
                type: 'string',
                description: 'Name of the district.',
              },
            },
            example: {
              id: 1,
              cityId: 1,
              name: 'Test district',
              image: "Test.png",
            },
          },
          EducationCenter: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the education center.',
              },
              name: {
                type: 'string',
                description: 'Name of the education center.',
              },
              description: {
                type: 'string',
                description: 'Description of the education center.',
              },
              image: {
                type: 'string',
                description: 'Image of the education center.',
              },
            },
            example: {
              id: 1,
              name: 'Test Education Center',
              description: 'Test description',
              image: "Test.png",
            },
          },
          Enrollment: {
            type: 'object',
            properties: {
              userId: {
                type: 'integer',
                description: 'Unique identifier for the user.',
              },
              courseId: {
                type: 'integer',
                description: 'Unique identifier for the course.',
              },
            },
            example: {
              userId: 10,
              courseId: 1001,
            },
          },
          FAQ: {
            type: 'object',
            required: ['question', 'answer'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the FAQ.',
              },
              question: {
                type: 'string',
                description: 'The question being asked.',
              },
              answer: {
                type: 'string',
                description: 'The answer to the question.',
              },
            },
            example: {
              id: 1,
              question: 'How do I reset my password?',
              answer: 'You can reset your password by going to account settings.',
            },
          },
          Notification: {
            type: 'object',
            required: ['userId', 'content'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the notification.',
              },
              userId: {
                type: 'integer',
                description: 'ID of the user the notification is for.',
              },
              content: {
                type: 'string',
                description: 'The content of the notification.',
              },
              seen: {
                type: 'boolean',
                description: 'Whether or not the notification has been seen.',
              },
            },
            example: {
              id: 1,
              userId: 12,
              content: 'Your course starts tomorrow.',
              seen: false,
            },
          },
          Payment: {
            type: 'object',
            required: ['userId', 'contractId', 'amount', 'status', 'method'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the payment.',
              },
              userId: {
                type: 'integer',
                description: 'ID of the user making the payment.',
              },
              contractId: {
                type: 'integer',
                description: 'ID of the associated contract.',
              },
              amount: {
                type: 'number',
                format: 'float',
                description: 'Amount of money paid.',
              },
              status: {
                type: 'string',
                description: 'Status of the payment.',
              },
              method: {
                type: 'string',
                description: 'Method used for payment.',
              },
            },
            example: {
              id: 1,
              userId: 15,
              contractId: 2001,
              amount: 250.5,
              status: 'Completed',
              method: 'Credit Card',
            },
          },
          Review: {
            type: 'object',
            required: ['userId', 'branchId', 'rating', 'description'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the review.',
              },
              userId: {
                type: 'integer',
                description: 'ID of the user who wrote the review.',
              },
              branchId: {
                type: 'integer',
                description: 'ID of the branch being reviewed.',
              },
              rating: {
                type: 'integer',
                description: 'Rating given in the review.',
              },
              description: {
                type: 'string',
                description: 'Text of the review.',
              },
            },
            example: {
              id: 1,
              userId: 25,
              branchId: 3,
              rating: 4,
              description: 'Great experience, but some rooms can be improved.',
            },
          },
          SearchHistory: {
            type: 'object',
            required: ['userId', 'query'],
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the search history entry.',
              },
              userId: {
                type: 'integer',
                description: 'ID of the user who performed the search.',
              },
              query: {
                type: 'string',
                description: 'The search query string.',
              },
            },
            example: {
              id: 1,
              userId: 27,
              query: 'Data Science courses',
            },
          },
          Subdistrict: {
            type: 'object',
            required: ['name'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the subdistrict.',
              },
              districtId: {
                type: 'integer',
                description: 'The foreign key for the subdistrict that the subdistrict is part of.'
              },
              name: {
                type: 'string',
                description: 'Name of the subdistrict.',
              },
            },
            example: {
              id: 1,
              districtId: 1,
              name: 'Test subdistrict',
              image: "Test.png",
            },
          },
          User: {
            type: 'object',
            required: ['email', 'password', 'name', 'userRoleId'], // fields that are mandatory when creating a new object
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the user.',
                example: 101,
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Email address of the user.',
                example: 'user@example.com',
              },
              password: {
                type: 'string',
                description: 'Password for the user. This should be sent over a secure connection and stored securely.',
                example: 'supersecretpassword',
              },
              name: {
                type: 'string',
                description: 'Full name of the user.',
                example: 'John Doe',
              },
              workEducationCenterId: {
                type: 'integer',
                description: 'ID of the education center where the user is employed.',
                example: 1,
              },
              userRoleId: {
                type: 'integer',
                description: 'User role.',
                example: 1,
              },
              profileImage: {
                type: 'string',
                description: 'URL of the profile image.',
                example: 'http://example.com/path/to/image.jpg',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time of record creation.',
                example: '2023-01-30T12:34:56Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time of the last update on the record.',
                example: '2023-02-01T07:54:21Z',
              },
            },
          },      
          UserRole: {
            type: 'object',
            required: ['roleName'], // assuming these are required fields
            properties: {
              id: {
                type: 'integer',
                description: 'Unique identifier for the UserRole.',
              },
              roleName: {
                type: 'string',
                description: 'roleName of the UserRole.',
              },
            },
            example: {
              id: 1,
              roleName: 'Test UserRole',
            },
          },    
          // You can define other schemas here...
        },
        // other component definitions (e.g., securitySchemes, requestBodies, etc.)
      },
    },
    apis: ['./routes/*.js'], // Path to the API docs (your route files)
  };

// Initialize swagger-jsdoc -> returns validated swagger spec in JSON format
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
