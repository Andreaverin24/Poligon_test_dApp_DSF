import { Accordion } from 'flowbite-react';

interface FAQAccordionProps {
  items: Array<{
    title: string;
    content: React.ReactNode;
  }>
}

const FAQAccordion = (props: FAQAccordionProps) => {
  const {
    items,
  } = props;

  return (
    <Accordion collapseAll className="divide-y-0 border-0 flex flex-col gap-2">
      {
        items.map((faqItem) => (
          <Accordion.Panel key={faqItem.title}>
            <div className="rounded-2xl overflow-hidden">
              <Accordion.Title className="bg-[#FBFBFD] focus:ring-0 p-4">
                {faqItem.title}
              </Accordion.Title>
              <Accordion.Content className="bg-[linear-gradient(#FBFBFD,_#E0F3FF_90%)] p-4">
                {faqItem.content}
              </Accordion.Content>
            </div>
          </Accordion.Panel>
        ))
      }
    </Accordion>
  )
};

export default FAQAccordion;
