// Документация для получения списка компаний
/**
 * @swagger
 * /list:
 *   get:
 *     summary: Retrieve a list of companies
 *     description: Retrieve a list of companies with optional filters.
 *     parameters:
 *       - in: query
 *         name: s
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query for company names or INN.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number of the companies list.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of companies per page.
 *       - in: query
 *         name: closed
 *         schema:
 *           type: boolean
 *         description: Filter by companies that are closed.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Order of companies listed.
 *     responses:
 *       200:
 *         description: A list of companies.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalResults:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *       404:
 *         description: No companies found.
 *       500:
 *         description: Server error.
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - inn
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the company.
 *         name:
 *           type: string
 *           description: The name of the company.
 *         registerDate:
 *           type: string
 *           format: date
 *           description: The registration date of the company.
 *         closeDate:
 *           type: string
 *           format: date
 *           description: The close date of the company, if any.
 *         inn:
 *           type: string
 *           description: The INN of the company.
 *         ogrn:
 *           type: string
 *           description: The OGRN of the company.
 */

// Документация для обновления компании по ИНН
/**
 * @swagger
 * /update/{inn}:
 *   patch:
 *     summary: Update a company by INN
 *     description: Update details of a company by INN.
 *     parameters:
 *       - in: path
 *         name: inn
 *         schema:
 *           type: string
 *         required: true
 *         description: INN of the company to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the company.
 *               registerDate:
 *                 type: string
 *                 format: date
 *                 description: The registration date of the company.
 *               closeDate:
 *                 type: string
 *                 format: date
 *                 description: The close date of the company, if any.
 *               ogrn:
 *                 type: string
 *                 description: The OGRN of the company.
 *     responses:
 *       200:
 *         description: Updated company details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Company not found.
 *       500:
 *         description: Server error.
 */