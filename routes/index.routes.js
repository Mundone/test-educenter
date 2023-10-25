const router = require("express").Router();

const announcementsRouter = require('./announcement.routes');
const branchesRouter = require('./branch.routes');
const citiesRouter = require('./city.routes');
const contractsRouter = require('./contract.routes');
const coursesRouter = require('./course.routes');
const courseTagsRouter = require('./courseTag.routes');
const courseTagMappingsRouter = require('./courseTagMapping.routes');
const districtsRouter = require('./district.routes');
const educentersRouter = require('./educationCenter.routes');
const enrollmentsRouter = require('./enrollment.routes');
const faqsRouter = require('./faq.routes');
const notificationsRouter = require('./notification.routes');
const paymentsRouter = require('./payment.routes');
const reviewsRouter = require('./review.routes');
const searchHistoriesRouter = require('./searchHistory.routes');
const subdistrictsRouter = require('./subdistrict.routes');
const usersRouter = require('./user.routes');
const workersRouter = require('./worker.routes');

router.use('/announcements', announcementsRouter);
router.use('/branches', branchesRouter);
router.use('/cities', citiesRouter);
router.use('/contracts', contractsRouter);
router.use('/contracts', coursesRouter);
router.use('/courses', coursesRouter);
router.use('/courseTags', courseTagsRouter);
router.use('/courseTagMappings', courseTagMappingsRouter);
router.use('/districts', districtsRouter);
router.use('/educenters', educentersRouter);
router.use('/enrollments', enrollmentsRouter);
router.use('/faqs', faqsRouter);
router.use('/notifications', notificationsRouter);
router.use('/payments', paymentsRouter);
router.use('/reviews', reviewsRouter);
router.use('/searchHistories', searchHistoriesRouter);
router.use('/subdistricts', subdistrictsRouter);
router.use('/users', usersRouter);
router.use('/workers', workersRouter);


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
