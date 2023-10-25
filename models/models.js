module.exports = (sequelize, DataTypes) => {
    const Announcement = sequelize.define("Announcement", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        educationCenterId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'EducationCenters',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING(255)
        },
        content: {
            type: DataTypes.TEXT
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const Branch = sequelize.define("Branch", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        educationCenterId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'EducationCenters', // 'EducationCenters' is the table name
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(100)
        },
        subdistrictId: { // linking subdistrict (khoroo)
            type: DataTypes.INTEGER,
            references: {
                model: 'Subdistricts', // 'Subdistricts' is the table name
                key: 'id'
            }
        },
        otherDescription: {
            type: DataTypes.TEXT // for longer descriptions
        },
        latitude: {
            type: DataTypes.DOUBLE
        },
        longitude: {
            type: DataTypes.DOUBLE
        },
        image: {
            type: DataTypes.STRING // consider length if URLs might be long
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const City = sequelize.define("City", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // additional attributes, if any
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const Contract = sequelize.define("Contract", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Courses',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.STRING(50) // e.g., "pending", "approved", "rejected"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const Course = sequelize.define("Course", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        branchId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Branches',
                key: 'id'
            }
        },
        name: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.TEXT
        },
        startDate: {
            type: DataTypes.DATE
        },
        endDate: {
            type: DataTypes.DATE
        },
        enrollmentStartDate: {
            type: DataTypes.DATE
        },
        enrollmentEndDate: {
            type: DataTypes.DATE
        },
        maxStudents: {
            type: DataTypes.INTEGER
        },
        currentStudents: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const CourseTag = sequelize.define("CourseTag", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tagName: {
            type: DataTypes.STRING(100)
        }
    });
    
    const CourseTagMapping = sequelize.define("CourseTagMapping", {
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Courses',
                key: 'id'
            }
        },
        tagId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'CourseTags',
                key: 'id'
            }
        }
    });

    const District = sequelize.define("District", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cityId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Cities', // 'Cities' is the table name
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // additional attributes, if any
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
    

    
    const EducationCenter = sequelize.define("EducationCenter", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.STRING
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const Enrollment = sequelize.define("Enrollment", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Courses',
                key: 'id'
            }
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

   
    const Subdistrict = sequelize.define("Subdistrict", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        districtId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Districts', // 'Districts' is the table name
                key: 'id'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // additional attributes, if any
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
    
    const FAQ = sequelize.define("FAQ", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        question: {
            type: DataTypes.TEXT
        },
        answer: {
            type: DataTypes.TEXT
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
    
    const Notification = sequelize.define("Notification", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.STRING(255)
        },
        seen: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const Payment = sequelize.define("Payment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        contractId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Contracts',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.FLOAT
        },
        status: {
            type: DataTypes.STRING
        },
        method: {
            type: DataTypes.STRING(50) // e.g., "credit_card", "paypal"
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });
    
    const Review = sequelize.define("Review", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        branchId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Branches',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER // e.g., 1 to 5
        },
        description: {
            type: DataTypes.TEXT
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const SearchHistory = sequelize.define("SearchHistory", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        query: {
            type: DataTypes.STRING(255)
        },
        createdAt: DataTypes.DATE
    });
    
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING(100)
        },
        workEducationCenterId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'EducationCenters',
                key: 'id'
            }
        },
        userRoleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'UserRoles', // 'Cities' is the table name
                key: 'id'
            },
            allowNull: false
        },
        profileImage: {
            type: DataTypes.STRING
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    const UserRole = sequelize.define("UserRole", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roleName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    // Define associations
    Branch.belongsTo(EducationCenter, { foreignKey: 'educationCenterId', onDelete: 'CASCADE' });
    Branch.belongsTo(Subdistrict, { foreignKey: 'subdistrictId' });
    Branch.hasMany(Course, { foreignKey: 'branchId' });
    Branch.hasMany(Review, { foreignKey: 'branchId' });
    
    Contract.hasMany(Payment, { foreignKey: 'contractId' });

    Course.belongsTo(Branch, { foreignKey: 'branchId', onDelete: 'CASCADE' });
    Course.belongsToMany(User, { through: Enrollment, foreignKey: 'courseId' });
    Course.belongsToMany(CourseTag, { through: CourseTagMapping, foreignKey: 'courseId' });
    Course.hasMany(Contract, { foreignKey: 'courseId' });
    
    CourseTag.belongsToMany(Course, { through: CourseTagMapping, foreignKey: 'tagId' });
    
    City.hasMany(District, { foreignKey: 'cityId' });

    District.hasMany(Subdistrict, { foreignKey: 'districtId' });
    District.belongsTo(City, { foreignKey: 'cityId', onDelete: 'CASCADE' });
    
    EducationCenter.hasMany(Branch, { foreignKey: 'educationCenterId' });
    EducationCenter.hasMany(User, { foreignKey: 'workEducationCenterId' });
    EducationCenter.hasMany(Announcement, { foreignKey: 'educationCenterId' });
    
    User.belongsToMany(Course, { through: Enrollment, foreignKey: 'userId' });
    User.belongsTo(UserRole, { foreignKey: 'userRoleId'});
    User.hasMany(Payment, { foreignKey: 'userId' });
    User.hasMany(Contract, { foreignKey: 'userId' });
    User.hasMany(Review, { foreignKey: 'userId' });
    User.hasMany(Notification, { foreignKey: 'userId' });
    User.hasMany(SearchHistory, { foreignKey: 'userId' });
    User.belongsTo(EducationCenter, { foreignKey: 'workEducationCenterId', onDelete: 'CASCADE' });

    UserRole.hasMany(User, { foreignKey: 'userRoleId' });
    
    Subdistrict.belongsTo(District, { foreignKey: 'districtId', onDelete: 'CASCADE' });

    return {
        Announcement,
        Branch,
        City,
        Contract,
        Course,
        CourseTag,
        CourseTagMapping,
        District,
        EducationCenter,
        Enrollment,
        FAQ,
        Notification,
        Payment,
        Review,
        SearchHistory,
        Subdistrict,
        User,
        UserRole,
    };
};
