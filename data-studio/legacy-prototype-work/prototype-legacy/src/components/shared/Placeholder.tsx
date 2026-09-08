import { Heading } from '@floqastinc/flow-ui_core'

interface PlaceholderProps {
  title: string
  description?: string
}

export default function Placeholder({ title, description }: PlaceholderProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <Heading variant="lg">{title}</Heading>
        {description && <p className="mt-2 text-gray-500">{description}</p>}
      </div>
    </div>
  )
}
