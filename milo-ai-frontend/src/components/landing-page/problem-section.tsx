"use client"

export default function ProblemSection() {
  return (
    <section className="w-full border-t border-[rgba(55,50,47,0.12)] bg-[#F7F5F3]">
      <div className="max-w-[1060px] mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <h2 className="text-[#49423D] text-2xl md:text-4xl font-semibold leading-tight font-sans">
              The reality of daily care
            </h2>
            <p className="text-[#605A57] text-base leading-7 font-sans">
              Care teams juggle routines, medications, emotional states, and meaningful engagement — often with
              handwritten notes or fragmented tools. Coordination across shifts is hard and consistency varies day to
              day.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#E0DEDB] bg-white rounded-md p-5 flex flex-col gap-2">
              <h3 className="text-[#49423D] text-sm font-semibold leading-6">Emotional and operational costs</h3>
              <p className="text-[#605A57] text-sm leading-6">
                Forgetting a preference, missing a medication reminder, or losing context from yesterday’s conversation
                leads to frustration and distress — for residents, families, and staff alike.
              </p>
            </div>

            <div className="border border-[#E0DEDB] bg-white rounded-md p-5 flex flex-col gap-2">
              <h3 className="text-[#49423D] text-sm font-semibold leading-6">Why current tools fall short</h3>
              <p className="text-[#605A57] text-sm leading-6">
                Manual logs get inconsistent, generic chatbots lack resident context, and basic reminders don’t carry
                forward stories or routines that make care truly personal.
              </p>
            </div>

            <div className="border border-[#E0DEDB] bg-white rounded-md p-5 flex flex-col gap-2">
              <h3 className="text-[#49423D] text-sm font-semibold leading-6">What’s needed</h3>
              <p className="text-[#605A57] text-sm leading-6">
                An assistant that remembers every detail, supports every shift, and helps every resident feel seen — all
                with privacy by design.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
