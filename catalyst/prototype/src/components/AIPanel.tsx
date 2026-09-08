import svgPaths from "../imports/svg-btumgadxkh";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIPanel({ isOpen, onClose }: AIPanelProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="h-full bg-gradient-to-b from-[#fafbf9] rounded-[10px] to-[#f2f7f4] w-full flex flex-col relative overflow-hidden"
      style={{
        boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Decorative Background Blur Effects */}
      <div className="absolute left-[144px] size-[254px] top-[758px] pointer-events-none">
        <div className="absolute inset-[-78.74%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 654 654">
            <g filter="url(#filter0_f_2106_36531)" id="Ellipse 10">
              <circle cx="327" cy="327" fill="#027964" fillOpacity="0.15" r="127" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="654" id="filter0_f_2106_36531" width="654" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_2106_36531" stdDeviation="100" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[-14px] size-[226px] top-[758px] pointer-events-none">
        <div className="absolute inset-[-88.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 626 626">
            <g filter="url(#filter0_f_2106_38255)" id="Ellipse 10">
              <circle cx="313" cy="313" fill="#90E39A" fillOpacity="0.15" r="113" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="626" id="filter0_f_2106_38255" width="626" x="0" y="0">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
                <feGaussianBlur result="effect1_foregroundBlur_2106_38255" stdDeviation="100" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Header */}
      <HeaderWrap onClose={onClose} />
      
      {/* Main Content - scrollable */}
      <Container />
      
      {/* Message Input - fixed at bottom */}
      <MessageInput />
      
      <div aria-hidden="true" className="absolute border border-[#e4e7ec] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function HeaderWrap({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white relative shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e4e7ec] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start p-[18px] relative w-full">
        <SectionHeader onClose={onClose} />
      </div>
    </div>
  );
}

function SectionHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full z-[2]">
      <Frame7 />
      <Frame8 onClose={onClose} />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Menu />
      <p className="font-['Inter',sans-serif] font-semibold leading-[28px] not-italic relative shrink-0 text-[#101828] text-[14px]">FloQast</p>
    </div>
  );
}

function Menu() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute bottom-1/4 left-[12.5%] right-[12.5%] top-1/4">
        <div className="absolute inset-[-7.5%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 11.5">
            <path d={svgPaths.p348c7680} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame8({ onClose }: { onClose: () => void }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <IconFloatingPictureInPictureAlt />
      <button 
        onClick={onClose}
        className="flex items-center justify-center relative shrink-0 hover:bg-gray-100 rounded transition-colors"
      >
        <XClose />
      </button>
    </div>
  );
}

function IconFloatingPictureInPictureAlt() {
  return (
    <div className="relative shrink-0 size-[26px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26 26">
        <g id="icon-floating-picture_in_picture_alt">
          <mask height="26" id="mask0_2106_26182" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="26" x="0" y="0">
            <rect fill="#D9D9D9" height="26" id="Bounding box" width="26" />
          </mask>
          <g mask="url(#mask0_2106_26182)">
            <path d={svgPaths.p52ca380} fill="#667085" id="picture_in_picture_alt" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function XClose() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-1/4">
        <div className="absolute inset-[-7.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.5 11.5">
            <path d={svgPaths.p14b78080} id="Icon" stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-start pb-[32px] pt-[60px] px-[22px] relative size-full">
          <Frame4 />
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start not-italic relative shrink-0 w-full whitespace-pre-wrap">
      <p className="font-['Inter',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#424867] text-[16px] w-[249px]">Hi James, I'm ready to help.</p>
      <p className="font-['Inter',sans-serif] font-normal leading-[16px] min-w-full relative shrink-0 text-[#1d2433] text-[12px] w-[min-content]">I can answer questions, automate tasks, and provide insights.</p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['Inter',sans-serif] font-semibold leading-[16.5px] not-italic relative shrink-0 text-[#828282] text-[10px] tracking-[0.5px]">SUGGESTIONS</p>
      <Frame9 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0">
      <Frame10 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[342px]">
      <Container1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Content1 />
    </div>
  );
}

function Content1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative rounded-[8px] shrink-0 w-full">
      <FileSearch />
      <TextAndSupportingText />
    </div>
  );
}

function FileSearch() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[8.33%_8.33%_8.33%_16.67%]">
        <div className="absolute inset-[-5%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.5">
            <path d={svgPaths.p1d93c600} id="Icon" stroke="#076D5B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextAndSupportingText() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-baseline min-h-px min-w-px relative">
      <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#424867] text-[12px]">Highlight Priority Close Items</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[342px]">
      <Container2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Content2 />
    </div>
  );
}

function Content2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative rounded-[8px] shrink-0 w-full">
      <Inbox />
      <TextAndSupportingText1 />
    </div>
  );
}

function Inbox() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[16.67%_8.33%]">
        <div className="absolute inset-[-6.25%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 13.5001">
            <path d={svgPaths.p14a199f0} id="Icon" stroke="#076D5B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextAndSupportingText1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-baseline min-h-px min-w-px relative">
      <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#424867] text-[12px]">Surface Open Review Notes</p>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[342px]">
      <Container3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Content3 />
    </div>
  );
}

function Content3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative rounded-[8px] shrink-0 w-full">
      <File />
      <TextAndSupportingText2 />
    </div>
  );
}

function File() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[8.33%_16.67%]">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 16.5">
            <path d={svgPaths.p381d7380} id="Icon" stroke="#076D5B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextAndSupportingText2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-baseline min-h-px min-w-px relative">
      <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#424867] text-[12px]">Prepare Reconciliation Summary</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[342px]">
      <Container4 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Content4 />
    </div>
  );
}

function Content4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center overflow-clip relative rounded-[8px] shrink-0 w-full">
      <Star />
      <TextAndSupportingText3 />
    </div>
  );
}

function Star() {
  return (
    <div className="overflow-clip relative shrink-0 size-[18px]">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 16.5">
            <path d={svgPaths.pae8bc00} id="Icon" stroke="#076D5B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function TextAndSupportingText3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-baseline min-h-px min-w-px relative">
      <p className="font-['Inter',sans-serif] font-medium leading-[20px] not-italic relative shrink-0 text-[#424867] text-[12px]">Suggest Task Automations</p>
    </div>
  );
}

function MessageInput() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start pb-[22px] px-[22px] relative w-full">
        <Chat />
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="bg-white h-[122px] relative rounded-[10px] shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Text />
        <Frame />
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d5dd] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Text() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start p-[16px] relative size-full">
          <p className="font-['Inter',sans-serif] font-normal leading-[16px] not-italic overflow-hidden relative shrink-0 text-[#667085] text-[14px] text-ellipsis">Ask a question...</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-gradient-to-b from-[rgba(248,250,252,0)] relative shrink-0 to-[#f8fafc] w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[12px] relative w-full">
          <Frame5 />
          <Frame1 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] h-[32px] items-center relative shrink-0 w-[162px]">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <FormButton />
    </div>
  );
}

function FormButton() {
  return (
    <div className="h-[32px] max-h-[32px] relative rounded-[6px] shrink-0">
      <div className="content-stretch flex gap-[6px] h-full items-center justify-center max-h-[inherit] overflow-clip p-[8px] relative rounded-[inherit]">
        <CommentBank />
        <p className="font-['Polymath:Semibold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#424867] text-[12px] tracking-[-0.12px]">Prompt Library</p>
      </div>
      <div aria-hidden="true" className="absolute border-[#cbd2e1] border-[1.4px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function CommentBank() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="comment_bank">
          <mask height="20" id="mask0_2106_48605" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
            <rect fill="#D9D9D9" height="20" id="Bounding box" width="20" />
          </mask>
          <g mask="url(#mask0_2106_48605)">
            <path d={svgPaths.p3a1f1e00} fill="#667085" id="comment_bank_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[32px]">
      <FormButton1 />
    </div>
  );
}

function FormButton1() {
  return (
    <div className="flex-[1_0_0] h-[32px] max-h-[32px] min-h-px min-w-px relative rounded-[6px]">
      <div className="flex flex-row items-center justify-center max-h-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[6px] items-center justify-center max-h-[inherit] p-[8px] relative size-full">
          <MyLocation />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#cbd2e1] border-[1.4px] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function MyLocation() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="my_location">
          <mask height="20" id="mask0_2106_52056" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
            <rect fill="#D9D9D9" height="20" id="Bounding box" width="20" />
          </mask>
          <g mask="url(#mask0_2106_52056)">
            <path d={svgPaths.p12659a80} fill="#667085" id="my_location_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[6px] h-[32px] items-center justify-end pl-[8px] relative rounded-[6px] shrink-0 w-[66px]">
      <div aria-hidden="true" className="absolute border-[#cbd2e1] border-[1.4px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <WandShine />
      <FormButton2 />
    </div>
  );
}

function WandShine() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="wand_shine">
          <mask height="20" id="mask0_2106_19284" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
            <rect fill="#D9D9D9" height="20" id="Bounding box" width="20" />
          </mask>
          <g mask="url(#mask0_2106_19284)">
            <path d={svgPaths.p11cace80} fill="#6B7280" id="wand_shine_2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function FormButton2() {
  return (
    <div className="bg-[#226548] content-stretch flex gap-[8px] items-center justify-center max-h-[32px] overflow-clip px-[12px] py-[8px] relative rounded-[6px] shrink-0 size-[32px]">
      <ArrowWarmUpRun />
    </div>
  );
}

function ArrowWarmUpRun() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="arrow_warm_up_run">
          <mask height="20" id="mask0_2106_15834" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" x="0" y="0">
            <rect fill="#D9D9D9" height="20" id="Bounding box" width="20" />
          </mask>
          <g mask="url(#mask0_2106_15834)">
            <path d={svgPaths.p3f421f20} fill="white" id="arrow_warm_up" />
          </g>
        </g>
      </svg>
    </div>
  );
}