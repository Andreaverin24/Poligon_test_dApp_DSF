import './styles/knowledge_base.css';

interface KnowledgeBasePreviewProps {
  title: string;
  description: string;
  link: string;
  image: string;
}

const KnowledgeBasePreview = (props: KnowledgeBasePreviewProps) => {
  const {
    title,
    description,
    link,
    image
  } = props;

  return (
    <div className="rounded-[1.5rem] bg-white w-[248px]">
      <img src={image} alt={title} className="rounded-t-[1.5rem]" />
      <div className="flex flex-col justify-between p-6 h-[204px]">
        <b className="text-gray-900 font-semibold short">{title}</b>
        <p className="text-gray-500 text-sm short">{description}</p>
        <a href={link} target="_blank" className="text-blue font-semibold">Read</a>
      </div>
    </div>
  )
};

export default KnowledgeBasePreview;
