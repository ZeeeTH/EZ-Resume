# Resume Template Creation Guide

This guide explains how to create new resume templates for the EZ Resume application. Use this structure when asking ChatGPT to generate additional templates.

## 📁 **File Structure**

```
data/templates/
├── index.ts          # Template registry and helper functions
├── modern.json       # Modern Professional template
├── classic.json      # Classic Professional template
├── minimalist.json   # Minimalist Clean template
└── [new-template].json  # Your new templates here
```

## 🏗️ **Template Structure**

Each template follows this JSON structure:

```json
{
  "id": "unique-template-id",
  "name": "Template Display Name",
  "description": "Brief description of the template style and target audience",
  "category": "modern|classic|creative|minimalist|professional",
  "preview": "/templates/template-preview.png",
  "sections": {
    "header": {
      "name": "John Smith",
      "email": "john.smith@email.com",
      "phone": "+1 (555) 123-4567",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johnsmith",
      "website": "johnsmith.dev"
    },
    "summary": "Professional summary paragraph...",
    "experience": [
      {
        "company": "Company Name",
        "position": "Job Title",
        "startDate": "2022-01",
        "endDate": null,
        "current": true,
        "description": [
          "Achievement or responsibility bullet point 1",
          "Achievement or responsibility bullet point 2",
          "Achievement or responsibility bullet point 3"
        ]
      }
    ],
    "education": [
      {
        "institution": "University Name",
        "degree": "Degree Type",
        "field": "Field of Study",
        "startDate": "2016-09",
        "endDate": "2020-05",
        "current": false,
        "gpa": "3.8/4.0",
        "honors": ["Honor 1", "Honor 2"]
      }
    ],
    "skills": {
      "technical": ["Skill 1", "Skill 2", "Skill 3"],
      "soft": ["Soft Skill 1", "Soft Skill 2"],
      "languages": ["Language 1", "Language 2"]
    },
    "projects": [
      {
        "name": "Project Name",
        "description": "Project description",
        "technologies": ["Tech 1", "Tech 2"],
        "url": "project-url.com"
      }
    ],
    "certifications": [
      {
        "name": "Certification Name",
        "issuer": "Issuing Organization",
        "date": "2023-06",
        "url": "certification-url.com"
      }
    ],
    "achievements": [
      "Achievement 1",
      "Achievement 2",
      "Achievement 3"
    ]
  },
  "styling": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#64748b",
    "fontFamily": "Inter",
    "spacing": "standard",
    "layout": "single-column"
  }
}
```

## 🎨 **Template Categories**

### **Modern**
- Clean, contemporary design
- Bold typography and colors
- Perfect for tech and creative industries
- Examples: Modern Professional

### **Classic**
- Traditional, conservative design
- Professional and formal appearance
- Perfect for corporate environments
- Examples: Classic Professional

### **Minimalist**
- Clean, simple design with white space
- Focused on content over decoration
- Perfect for creative professionals
- Examples: Minimalist Clean

### **Creative**
- Unique, artistic designs
- Colorful and visually striking
- Perfect for design and creative roles
- Examples: (to be created)

### **Professional**
- Balanced between modern and classic
- Versatile for various industries
- Clean but not too bold
- Examples: (to be created)

## 🎯 **Styling Options**

### **Colors**
- `primaryColor`: Main accent color (hex code)
- `secondaryColor`: Secondary text color (hex code)

### **Typography**
- `fontFamily`: Font family name (Inter, Helvetica, Times New Roman, etc.)

### **Spacing**
- `compact`: Tight spacing for more content
- `standard`: Balanced spacing
- `spacious`: Lots of white space

### **Layout**
- `single-column`: Traditional single column layout
- `two-column`: Split into two columns
- `modern-grid`: Grid-based modern layout

## 📝 **Content Guidelines**

### **Header Section**
- Include all contact information
- Make name prominent
- Optional: LinkedIn, website, portfolio

### **Summary**
- 2-3 sentences maximum
- Focus on key achievements and value proposition
- Use action verbs and metrics when possible

### **Experience**
- Use reverse chronological order
- Include company, position, dates
- 3-4 bullet points per role
- Focus on achievements, not just responsibilities
- Use metrics and specific results

### **Education**
- Include institution, degree, field, dates
- Optional: GPA, honors, relevant coursework
- Only include if relevant to the role

### **Skills**
- Separate technical and soft skills
- Include languages if relevant
- Use industry-standard terminology

### **Projects** (Optional)
- Include for tech/creative roles
- Describe impact and technologies used
- Include URLs if available

### **Certifications** (Optional)
- Include relevant professional certifications
- Include dates and issuing organizations

### **Achievements** (Optional)
- Awards, publications, speaking engagements
- Industry recognition
- Community involvement

## 🔧 **Technical Requirements**

### **File Naming**
- Use kebab-case for file names: `creative-modern.json`
- Use descriptive names that indicate the style

### **ID Requirements**
- Must be unique across all templates
- Use kebab-case: `creative-modern`
- Should match the file name (without .json)

### **Date Format**
- Use ISO format: `YYYY-MM`
- For current positions, use `null` for `endDate`
- Set `current: true` for ongoing positions

### **URLs**
- Include full URLs (https://)
- Make them realistic but fictional
- Use appropriate domains for the context

## 📋 **Template Creation Checklist**

- [ ] Unique ID and descriptive name
- [ ] Clear category assignment
- [ ] Realistic sample data
- [ ] Proper date formatting
- [ ] Consistent styling options
- [ ] All required sections included
- [ ] Optional sections marked appropriately
- [ ] Professional contact information
- [ ] Achievements-focused experience bullets
- [ ] Relevant skills for the industry
- [ ] Proper JSON formatting

## 🚀 **Adding New Templates**

1. Create the JSON file in `data/templates/`
2. Add the template to the imports in `index.ts`
3. Add metadata to `templateMetadata` array
4. Update the `templates` array
5. Test the template in the application

## 💡 **Tips for ChatGPT**

When asking ChatGPT to create templates:

1. **Specify the category** (modern, classic, minimalist, creative, professional)
2. **Describe the target industry** (tech, marketing, design, finance, etc.)
3. **Mention the styling preferences** (colors, fonts, layout)
4. **Request realistic sample data** for that industry
5. **Ask for multiple variations** of the same category
6. **Specify the file naming convention** (kebab-case)

Example prompt:
"Create a creative resume template for a graphic designer. Use bold colors, modern typography, and include sample data for a designer with 3 years of experience. The template should be visually striking and perfect for creative industries. Name it 'creative-bold' and use a two-column layout."

## 📊 **Sample Data Guidelines**

### **Tech/Software**
- Focus on programming languages, frameworks, tools
- Include metrics like "reduced load time by 40%"
- Mention team sizes and project scales

### **Marketing**
- Include campaign results, ROI improvements
- Mention budget sizes and team management
- Focus on brand awareness and lead generation

### **Design**
- Include portfolio projects and client work
- Mention design tools and methodologies
- Focus on user experience and visual impact

### **Finance**
- Include budget management and cost savings
- Mention team sizes and reporting structures
- Focus on compliance and risk management

This structure ensures all templates are consistent, professional, and ready for production use! 