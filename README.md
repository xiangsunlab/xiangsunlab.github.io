# The Sun Research Group Website

Welcome to the Xiang Sun Group website, hosted at [https://xiangsunlab.github.io](https://xiangsunlab.github.io). This website follows a strict **content-first** architecture within the Astro web framework. All user-facing text, data, and image links are stored in Markdown (`.md`) files. Routine updates **never** require modifying `.astro`, `.ts`, or `.js` code files. 

## 1. Routine Content Updates

Most of the website's content is managed via structured lists located between the two `---` lines (the frontmatter) at the top of each Markdown file. To update an existing page, simply open the file, locate the relevant block, and modify the text inside the double quotes (`""`).

### A. Updating Publications
Publications are maintained in `src/content/pages/publications.md`. 
To add a new publication, copy an existing entry in the list and paste it at the appropriate position. 

* Keep commas `,` between objects in the list.
* The `"publication-type"` field is optional (supported labels are listed at the top of the file). If omitted, it defaults to `"Article"`.

```yaml
{
  "number": 52,
    "publication-type": "Article",
    "year": "2026",
    "authors": "Hao Zeng, Xiang Sun*",
    "title": "Estimating Memory Time within the Frameworks of Generalized Quantum Master Equation and Transfer Tensor Methods",
    "journal": "J. Chem. Phys. 164, 224117 (2026).",
    "journalName": "J. Chem. Phys.",
    "volume": "164",
    "locator": "224117 (2026).",
    "doiUrl": "https://doi.org/10.1063/5.0325277",
    "newsUrl": "/news/",
    "specialIssue": "Jianshu Cao Festschrift",
    "specialIssueUrl": "https://publishing.aip.org/publications/journals/special-topics/jcp/festschrift-in-honor-of-jianshu-cao-non-equilibrium-kinetics-and-quantum-dynamics/",
    "image": "/web-pics/paper-52-toc.png",
    "imageAlt": "Illustration of quantum dynamical models and memory effects"
},
```


### B. Adding News

All news entries are maintained in one file: `src/content/news.md`.
The website automatically sorts the `items` list by `"date"` (newest first), displays 10 entries per page, and automatically creates pagination (e.g., `/news/2/`).

To add a news entry, insert a new object at the beginning of the `items` list:

```yaml
{
  "title": "A short news headline",
  "date": "2026-06-17",
  "content": "Write the news content here. Markdown [links](https://...) and *emphasis* are supported. Use \\n\\n for paragraph breaks.",
  "image": "/news-pics/example.jpg",
  "imageAlt": "A concise description of the image",
  "imageWidth": 60
},
```

* `"imageWidth"` is optional (accepts a percentage from 20 to 100).

* To hide an entry temporarily, add `"draft": true` to the object.

### C. Editing Existing Pages  

* Home: `src/content/pages/home.md` (Contains the headline, group description, and hero image path)

* People: `src/content/pages/people.md`

* Research: `src/content/pages/research.md`

* Teaching: `src/content/pages/teaching.md`

* Join Us: `src/content/pages/join.md`

* Software: `src/content/pages/software.md`

* Books: `src/content/pages/books.md`

* Photos: `src/content/pages/Photos.md`

* Contact: `src/content/pages/contact.md`


## 2. Image Management

All images must be placed in the correct public folder before referencing them in Markdown. Use absolute paths starting with `/`.

* News Images: Upload to `public/news-pics/`.

  * Path format: `"image": "/news-pics/your-image.jpg"`

* All Other Images (Profiles, TOC Graphics, etc.): Upload to `public/web-pics/`.

  * Path format: `"image": "/web-pics/your-image.jpg"`

Always provide meaningful `"imageAlt"` text unless the image is purely decorative.


## 3. Adding or Editing Structured Pages

For pages with complex layouts—like grids, cards, or specific data modules—we use the Frontmatter Method. This means all text, lists, and image paths are stored as YAML data at the very top of the `.md` file, between the two `---` lines. The bottom of the file is left empty.

Our Research (`research.md`) and Teaching (`teaching.md`) pages are built this way.

### Step 1. Manage the Data in Markdown

When you open a structured file like `src/content/pages/research.md`, you will see different types of data fields. You can edit existing fields or copy them to add new entries.

Here are the data structures we use, using the `research.md` file as an example:

#### (1) Basic Strings (For titles, labels, and short text):
```yaml
title: "Research"
eyebrow: "What we study"
description: "We study quantum and classical dynamics in the condensed phase..."
```

#### (2) Arrays of Strings (For simple lists or tags):
```yaml
researchAreas: [
  "Theoretical Chemical Physics",
  "Molecular Dynamics",
  "Quantum Dynamics"
]
```


#### (3) Arrays of Objects (For generating repeating cards or sections):
This is used for the main research topics. Each topic is an "object" enclosed in `{ }`, containing its own title, description, image, and nested publications.

```yaml
areas: [
  {
    "number": "1",
    "title": "Photoinduced Charge and Energy Transfer Dynamics",
    "description": "We study charge and excitation-energy transfer...",
    "image": "/web-pics/research-01.png",
    "publications": [
      {
        "title": "All-Atom Photoinduced Charge Transfer Dynamics...",
        "authors": "Zengkui Liu, Zailing Song, Xiang Sun*",
        "journal": "J. Chem. Theory Comput."
      }
    ]
  },
  {
    "number": "2",
    "title": "Multi-Electronic-State Models for Complex Condensed Matter",
    "description": "We develop effective Hamiltonians...",
    "image": "/web-pics/research-02.png",
    "publications": [] 
  }
]
```


#### (4) Single Objects (For unique, standalone modules):

This is used when a specific section needs multiple pieces of related information, such as the highlighted course at the top of the Teaching page (·teaching.md·):

```yaml
featuredCourse: {
  "label": "Most Recent Course",
  "code": "CHEM-GA 9668",
  "title": "Chemical Dynamics",
  "term": "Spring 2026 · Shanghai",
  "syllabusLabel": "View Syllabus",
  "syllabusUrl": "https://wp.nyu.edu/xiangsun/files/2026/01/Syllabus_CHEM-GA9668_Spring2026.pdf"
}
```


### Step 2: Render the Data in Astro
If you are creating a completely new structured page, you must create an Astro template (e.g., `src/pages/research.astro`) to map this YAML data into HTML.

Do not hardcode text into the `.astro` file. Instead, fetch the data and use `.map()` to generate lists automatically:

```yaml
---
import InnerPage from "../components/InnerPage.astro";
import { getPageData } from "../data/pages";
import { parseInlineMarkdown } from "../utils/markdown";

// 1. Fetch the data from the markdown file
const page = await getPageData("research");
---

<InnerPage title={page.title} description={page.description} current="research">
  
  <div class="tags">
    {page.researchAreas.map((area) => (
      <span>{area}</span>
    ))}
  </div>

  <div class="research-grid">
    {page.areas.map((area) => (
      <article class="research-card">
        <h2>{area.title}</h2>
        
        <p set:html={parseInlineMarkdown(area.description)}></p>
        
        <img src={area.image} alt={area.title} />
      </article>
    ))}
  </div>

</InnerPage>
```




## 4. Preview, Verification, and Deployment

To view your changes locally and ensure they are error-free before publishing, you will use two main commands in your terminal.

### A. Local live preview
```
npm run dev

```

* It starts a local development server (usually available at `http://localhost:4321`).
* It features "hot reloading," meaning your browser will automatically refresh to show your changes the moment you save a Markdown file.

### B. Verification
```
npm run build
```
Use this command **before** committing and pushing your changes to GitHub.

* It simulates the final production process and performs a strict syntax check on all your Markdown files and YAML data.
* If you missed a comma, forgot a quotation mark, or made a structural error in the frontmatter, this command will immediately fail and point out the exact line causing the issue.
* **Why this is critical:** If you push code with a syntax error, the GitHub Actions deployment will silently fail in the background, and your live website will not update. A successful local build guarantees a successful live deployment.

### C. Deployment to GitHub

A successful build confirms all pages can be generated. Once you push your changes to the `main` branch by using `git push origin main`, GitHub Actions will automatically deploy the updates to `https://xiangsunlab.github.io`.


Thanks for your interest! 


