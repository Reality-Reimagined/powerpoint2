import pptxgen from 'pptxgenjs';
import type { Presentation } from '../types';
import { THEME_STYLES } from '../services/ai';

export async function exportToPowerPoint(presentation: Presentation): Promise<void> {
  // Create a new PowerPoint presentation
  const pptx = new pptxgen();

  // Set presentation properties
  pptx.author = 'AI Presentation Generator';
  pptx.title = presentation.config.topic;
  
  // Get theme colors
  const theme = THEME_STYLES[presentation.config.style].pptx;

  // Set the master slide background and theme
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: theme.background },
    objects: [
      { 'line': { x: 0, y: '90%', w: '100%', h: 0, line: { color: theme.accent, width: 1 } } }
    ]
  });

  // Process each slide
  for (const slide of presentation.slides) {
    const pptSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

    // Add title
    pptSlide.addText(slide.title, {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '15%',
      fontSize: 44,
      color: theme.text,
      bold: true,
      align: 'left',
      fontFace: 'Arial'
    });

    // Add image if available
    if (slide.imageUrl) {
      try {
        let imageData;
        
        if (slide.imageUrl.startsWith('data:image')) {
          imageData = slide.imageUrl;
        } else {
          const response = await fetch(slide.imageUrl);
          const blob = await response.blob();
          imageData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }

        await pptSlide.addImage({
          data: imageData,
          x: '5%',
          y: '25%',
          w: '45%',
          h: '60%',
          sizing: { type: 'contain' }
        });
      } catch (error) {
        console.error('Failed to add image to slide:', error);
      }
    }

    // Add content with proper formatting
    const contentX = slide.imageUrl ? '55%' : '5%';
    const contentW = slide.imageUrl ? '40%' : '90%';

    pptSlide.addText(slide.content, {
      x: contentX,
      y: '25%',
      w: contentW,
      h: '50%',
      fontSize: 24,
      color: theme.text,
      align: 'left',
      breakLine: true,
      fontFace: 'Arial'
    });

    // Add sources if available
    if (slide.sources && slide.sources.length > 0) {
      pptSlide.addText(slide.sources.join('\n'), {
        x: '5%',
        y: '85%',
        w: '90%',
        h: '10%',
        fontSize: 12,
        color: theme.text,
        italic: true,
        align: 'left',
        fontFace: 'Arial'
      });
    }

    // Add speaker notes
    if (slide.notes) {
      pptSlide.addNotes({ text: slide.notes });
    }
  }

  // Add a references slide if available
  if (presentation.references && presentation.references.length > 0) {
    const referencesSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

    referencesSlide.addText('References', {
      x: '5%',
      y: '5%',
      w: '90%',
      h: '15%',
      fontSize: 44,
      color: theme.text,
      bold: true,
      align: 'left',
      fontFace: 'Arial'
    });

    referencesSlide.addText(presentation.references.join('\n\n'), {
      x: '5%',
      y: '25%',
      w: '90%',
      h: '70%',
      fontSize: 18,
      color: theme.text,
      align: 'left',
      breakLine: true,
      fontFace: 'Arial'
    });
  }

  // Save the presentation
  const fileName = `${presentation.config.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
  await pptx.writeFile({ fileName });
}