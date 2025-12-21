const currentMonth = moment().month(); // current month index (0-11)
const currentYear = moment().year();
// Days of week (change "ddd" to "dddd" if you want full name)
const daysOfWeek = Array.from({ length: 7 }, (\_, i) =>
moment().weekday(i).format("ddd"),
);

// Get first day of month & total days
const firstDayOfMonth = moment([currentYear, currentMonth, 1]).day();
const daysInMonthCount = moment([currentYear, currentMonth]).daysInMonth();

// Fill calendar slots
const daysInMonth = [
...Array(firstDayOfMonth).fill(null), // empty slots before start
...Array.from({ length: daysInMonthCount }, (_, i) => i + 1),
];

<Flexcol className={"w-max gap-2"}>
<Flexrow className="items-center gap-2">
<Icons.checkCircle className="text-exp-t" />
{moment().format("MMMM, YYYY")}
</Flexrow>

<div className="!text-14px w-max font-para2-m">
{/_ Days Header _/}
<div className="from-gradBot to-gradTop shadow-shadowBlack border-br1 mb-2 grid grid-cols-7 rounded-md border bg-gradient-to-t px-2">
{daysOfWeek.map((day) => (
<div key={day} className="p-1.5 text-center text-white">
{day}
</div>
))}
</div>

            {/* Dates */}
            <div className="grid grid-cols-7 text-center">
              {daysInMonth.map((day, idx) => {
                return (
                  <>
                    {day == moment().date() && (
                      <div key={idx} className={"py-1.5"}>
                        <span className="bg-exp-brounded-xs p-1">{day}</span>
                      </div>
                    )}
                    <div key={idx} className={"py-1.5"}>
                      {day}
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </Flexcol>
