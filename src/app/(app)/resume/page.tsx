'use client';

import { useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const resumeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  summary: z.string().min(20, 'Summary should be at least 20 characters'),
  experience: z.array(
    z.object({
      jobTitle: z.string().min(1, 'Job title is required'),
      company: z.string().min(1, 'Company is required'),
      location: z.string().min(1, 'Location is required'),
      dates: z.string().min(1, 'Dates are required'),
      description: z.string().min(1, 'Description is required'),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      school: z.string().min(1, 'School is required'),
      location: z.string().min(1, 'Location is required'),
      dates: z.string().min(1, 'Dates are required'),
    })
  ),
  skills: z.string().min(1, 'Skills are required'),
  customSections: z.array(
    z.object({
        title: z.string().min(1, 'Section title is required'),
        description: z.string().min(1, 'Section content is required'),
    })
  ),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

export default function ResumePage() {
  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      experience: [
        { jobTitle: '', company: '', location: '', dates: '', description: '' },
      ],
      education: [{ degree: '', school: '', location: '', dates: '' }],
      skills: '',
      customSections: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: 'experience',
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control: form.control,
    name: 'education',
  });

   const { fields: customFields, append: appendCustom, remove: removeCustom } = useFieldArray({
    control: form.control,
    name: 'customSections',
  });

  const resumeData = form.watch();
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    const input = resumePreviewRef.current;
    if (!input) {
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Increase scale for better resolution
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in points: 595.28 x 841.89
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let finalCanvasWidth, finalCanvasHeight;

      // Fit content to page width
      finalCanvasWidth = pdfWidth;
      finalCanvasHeight = finalCanvasWidth / canvasAspectRatio;
      
      // If content is longer than one page, split it
      let heightLeft = canvasHeight;
      let position = 0;
      
      const pageCanvas = document.createElement('canvas');
      const pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = (canvasWidth / pdfWidth) * pdfHeight; // Height of one PDF page in canvas pixels
      
      while (heightLeft > 0) {
        const sourceY = position * pageCanvas.height;
        pageCtx?.drawImage(canvas, 0, sourceY, canvasWidth, pageCanvas.height, 0, 0, pageCanvas.width, pageCanvas.height);
        const pageImgData = pageCanvas.toDataURL('image/png');
        
        if (position > 0) {
            pdf.addPage();
        }
        
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
        heightLeft -= pageCanvas.height;
        position++;
      }

      pdf.save(`${(resumeData.fullName || 'resume').replace(' ', '_')}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };


  return (
    <div className="container mx-auto">
      <div className="mb-8 flex justify-between items-center print:hidden">
        <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl font-headline">
            Resume Builder
            </h1>
            <p className="text-lg text-muted-foreground">
            Craft your professional story.
            </p>
        </div>
        <Button onClick={handleDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 print:hidden">
        <div>
          <Form {...form}>
            <form className="space-y-8">
              {/* Personal Details */}
              <div className="space-y-4 rounded-lg border p-4">
                <h3 className="text-lg font-medium">Personal Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField control={form.control} name="fullName" render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="address" render={({ field }) => <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                </div>
                 <FormField control={form.control} name="summary" render={({ field }) => <FormItem><FormLabel>Professional Summary</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>
              
              {/* Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Work Experience</h3>
                {expFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                    <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                      <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    </div>
                    <FormField control={form.control} name={`experience.${index}.dates`} render={({ field }) => <FormItem><FormLabel>Dates</FormLabel><FormControl><Input placeholder="e.g., Jan 2020 - Present" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} />
                    {index > 0 && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ jobTitle: '', company: '', location: '', dates: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Experience</Button>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education</h3>
                {eduFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                     <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => <FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => <FormItem><FormLabel>School/University</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                        <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                     </div>
                     <FormField control={form.control} name={`education.${index}.dates`} render={({ field }) => <FormItem><FormLabel>Dates</FormLabel><FormControl><Input placeholder="e.g., Aug 2016 - May 2020" {...field} /></FormControl><FormMessage /></FormItem>} />
                     {index > 0 && <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ degree: '', school: '', location: '', dates: '' })}><PlusCircle className="mr-2 h-4 w-4" /> Add Education</Button>
              </div>

              {/* Skills */}
              <div className="space-y-4 rounded-lg border p-4">
                 <FormField control={form.control} name="skills" render={({ field }) => <FormItem><FormLabel>Skills</FormLabel><FormControl><Textarea placeholder="e.g., JavaScript, React, Node.js, SQL, Project Management" {...field} /></FormControl><FormMessage /></FormItem>} />
              </div>

              {/* Custom Sections */}
               <div className="space-y-4">
                <h3 className="text-lg font-medium">Additional Sections</h3>
                {customFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 rounded-lg border p-4 relative">
                    <FormField control={form.control} name={`customSections.${index}.title`} render={({ field }) => <FormItem><FormLabel>Section Title</FormLabel><FormControl><Input placeholder="e.g., Certifications" {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name={`customSections.${index}.description`} render={({ field }) => <FormItem><FormLabel>Content</FormLabel><FormControl><Textarea placeholder="Describe your accomplishments, projects, etc." {...field} /></FormControl><FormMessage /></FormItem>} />
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCustom(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendCustom({ title: '', description: ''})}><PlusCircle className="mr-2 h-4 w-4" /> Add Section</Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Resume Preview */}
        <div className="lg:h-fit lg:sticky lg:top-24">
            <div ref={resumePreviewRef} className="bg-card p-8 shadow-lg rounded-lg border">
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold font-headline">{resumeData.fullName || 'Your Name'}</h1>
                    <p className="text-sm text-muted-foreground">
                    {resumeData.email} {resumeData.phone && `| ${resumeData.phone}`} {resumeData.address && `| ${resumeData.address}`}
                    </p>
                </header>
                
                <main>
                    <section className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2 font-headline">Summary</h2>
                    <p className="text-sm">{resumeData.summary}</p>
                    </section>
                    
                    <section className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2 font-headline">Work Experience</h2>
                    {resumeData.experience?.map((exp, index) => (
                        <div key={index} className="mb-4">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold">{exp.jobTitle}</h3>
                            <p className="text-sm text-muted-foreground">{exp.dates}</p>
                        </div>
                        <div className="flex justify-between items-baseline text-sm">
                            <p className="italic">{exp.company}</p>
                            <p className="text-muted-foreground">{exp.location}</p>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                    ))}
                    </section>
                    
                    <section className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2 font-headline">Education</h2>
                    {resumeData.education?.map((edu, index) => (
                        <div key={index} className="mb-2">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold">{edu.degree}</h3>
                            <p className="text-sm text-muted-foreground">{edu.dates}</p>
                        </div>
                        <div className="flex justify-between items-baseline text-sm">
                            <p className="italic">{edu.school}</p>
                            <p className="text-muted-foreground">{edu.location}</p>
                        </div>
                        </div>
                    ))}
                    </section>

                    <section className="mb-6">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2 font-headline">Skills</h2>
                    <p className="text-sm">{resumeData.skills}</p>
                    </section>

                    {resumeData.customSections?.map((section, index) => (
                        <section key={index} className="mb-6">
                            <h2 className="text-xl font-semibold border-b pb-1 mb-2 font-headline">{section.title}</h2>
                            <p className="text-sm whitespace-pre-wrap">{section.description}</p>
                        </section>
                    ))}
                </main>
            </div>
        </div>
      </div>
      
      {/* Hidden printable resume */}
      <div className="hidden">
        <div id="printable-resume" className="bg-white text-black p-8">
             <header className="text-center mb-6">
            <h1 className="text-3xl font-bold font-headline">{resumeData.fullName || 'Your Name'}</h1>
            <p className="text-sm text-gray-600">
              {resumeData.email} {resumeData.phone && `| ${resumeData.phone}`} {resumeData.address && `| ${resumeData.address}`}
            </p>
          </header>
          
          <main>
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2 font-headline">Summary</h2>
              <p className="text-sm">{resumeData.summary}</p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2 font-headline">Work Experience</h2>
              {resumeData.experience?.map((exp, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{exp.jobTitle}</h3>
                    <p className="text-sm text-gray-500">{exp.dates}</p>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <p className="italic">{exp.company}</p>
                    <p className="text-gray-500">{exp.location}</p>
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2 font-headline">Education</h2>
              {resumeData.education?.map((edu, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-gray-500">{edu.dates}</p>
                  </div>
                   <div className="flex justify-between items-baseline text-sm">
                    <p className="italic">{edu.school}</p>
                    <p className="text-gray-500">{edu.location}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2 font-headline">Skills</h2>
              <p className="text-sm">{resumeData.skills}</p>
            </section>

            {resumeData.customSections?.map((section, index) => (
                <section key={index} className="mb-6">
                    <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2 font-headline">{section.title}</h2>
                    <p className="text-sm whitespace-pre-wrap">{section.description}</p>
                </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}
