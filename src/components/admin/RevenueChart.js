"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


function compactNumber(value) {
  return new Intl.NumberFormat(
    "en-LK",
    {
      notation:
        "compact",

      maximumFractionDigits:
        1,
    }
  ).format(
    Number(
      value || 0
    )
  );
}


function money(value) {
  return new Intl.NumberFormat(
    "en-LK",
    {
      style:
        "currency",

      currency:
        "LKR",

      maximumFractionDigits:
        0,
    }
  ).format(
    Number(
      value || 0
    )
  );
}


function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (
    !active ||
    !payload?.length
  ) {
    return null;
  }


  const item =
    payload[0]?.payload;


  return (
    <div
      className="
        min-w-[165px]
        rounded-xl
        border
        border-[#DCE7EA]
        bg-white/95
        p-3
        shadow-[0_15px_40px_rgba(28,59,87,0.13)]
        backdrop-blur-xl
      "
    >

      <div
        className="
          mb-2
          border-b
          border-[#E5ECEF]
          pb-2
          text-[10px]
          font-extrabold
          text-[#1C3B57]
        "
      >
        {label}
      </div>


      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          text-[9px]
          text-[#6D7E8A]
        "
      >
        <span>
          Revenue
        </span>

        <strong className="text-[#1C3B57]">
          {money(
            item?.revenue
          )}
        </strong>
      </div>


      <div
        className="
          mt-1.5
          flex
          items-center
          justify-between
          gap-4
          text-[9px]
          text-[#6D7E8A]
        "
      >
        <span>
          Orders
        </span>

        <strong className="text-[#1C3B57]">
          {item?.orders ||
            0}
        </strong>
      </div>

    </div>
  );
}


export default function RevenueChart({
  daily = [],
  monthly = [],
}) {
  const [
    mode,
    setMode,
  ] =
    useState(
      "daily"
    );


  const data =
    mode ===
    "daily"
      ? daily
      : monthly;


  const summary =
    useMemo(
      () => {

        const total =
          data.reduce(
            (
              sum,
              item
            ) =>
              sum +
              Number(
                item.revenue ||
                  0
              ),
            0
          );


        const peak =
          data.reduce(
            (
              best,
              item
            ) =>
              Number(
                item.revenue ||
                  0
              ) >
              Number(
                best?.revenue ||
                  0
              )
                ? item
                : best,
            null
          );


        return {
          total,
          peak,
        };
      },
      [
        data,
      ]
    );


  return (
    <article
      className="
        rounded-[22px]
        border
        border-[#E5ECEF]
        bg-white/95
        p-[22px]
        shadow-[0_14px_40px_rgba(28,59,87,0.08)]
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-5

          max-md:flex-col
        "
      >
        <div>

          <div
            className="
              mb-1
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              text-[#0094B6]
            "
          >
            Revenue Intelligence
          </div>


          <h2
            className="
              text-[17px]
              font-extrabold
              tracking-[-0.025em]
              text-[#1C3B57]
            "
          >
            Revenue trend
          </h2>


          <p
            className="
              mt-1
              text-[11px]
              leading-5
              text-[#6D7E8A]
            "
          >
            Compare revenue movement
            across the selected period.
          </p>

        </div>


        {/* SWITCH */}

        <div
          className="
            flex
            items-center
            gap-1
            rounded-xl
            border
            border-[#E5ECEF]
            bg-[#F2F6F7]
            p-1

            max-md:w-full
          "
        >

          <button
            type="button"
            onClick={() =>
              setMode(
                "daily"
              )
            }
            className={`
              h-8
              min-w-[72px]
              rounded-lg
              px-3
              text-[9px]
              font-extrabold
              transition

              max-md:flex-1

              ${
                mode ===
                "daily"
                  ? `
                      bg-white
                      text-[#1C3B57]
                      shadow-[0_4px_12px_rgba(28,59,87,0.08)]
                    `
                  : `
                      text-[#748791]
                      hover:text-[#1C3B57]
                    `
              }
            `}
          >
            Daily
          </button>


          <button
            type="button"
            onClick={() =>
              setMode(
                "monthly"
              )
            }
            className={`
              h-8
              min-w-[72px]
              rounded-lg
              px-3
              text-[9px]
              font-extrabold
              transition

              max-md:flex-1

              ${
                mode ===
                "monthly"
                  ? `
                      bg-white
                      text-[#1C3B57]
                      shadow-[0_4px_12px_rgba(28,59,87,0.08)]
                    `
                  : `
                      text-[#748791]
                      hover:text-[#1C3B57]
                    `
              }
            `}
          >
            Monthly
          </button>

        </div>

      </div>


      {/* SUMMARY */}

      <div
        className="
          mt-5
          flex
          items-center
          gap-10
          rounded-[14px]
          border
          border-[#E5ECEF]
          bg-gradient-to-r
          from-[#FAFCFC]
          to-[#F7FAFB]
          px-4
          py-3

          max-sm:flex-col
          max-sm:items-start
          max-sm:gap-3
        "
      >

        <div>
          <span
            className="
              block
              text-[8px]
              font-bold
              uppercase
              tracking-[0.06em]
              text-[#84949D]
            "
          >
            Period revenue
          </span>

          <strong
            className="
              mt-1
              block
              text-xs
              font-extrabold
              text-[#1C3B57]
            "
          >
            {money(
              summary.total
            )}
          </strong>
        </div>


        <div>
          <span
            className="
              block
              text-[8px]
              font-bold
              uppercase
              tracking-[0.06em]
              text-[#84949D]
            "
          >
            Highest{" "}
            {mode ===
            "daily"
              ? "day"
              : "month"}
          </span>

          <strong
            className="
              mt-1
              block
              text-xs
              font-extrabold
              text-[#1C3B57]
            "
          >
            {summary.peak
              ?.label ||
              "—"}
          </strong>
        </div>


        <div>
          <span
            className="
              block
              text-[8px]
              font-bold
              uppercase
              tracking-[0.06em]
              text-[#84949D]
            "
          >
            Peak revenue
          </span>

          <strong
            className="
              mt-1
              block
              text-xs
              font-extrabold
              text-[#1C3B57]
            "
          >
            {money(
              summary.peak
                ?.revenue ||
                0
            )}
          </strong>
        </div>

      </div>


      {/* CHART */}

      {data.length ? (

        <div
          className="
            mt-4
            h-[330px]
            w-full

            max-sm:h-[260px]
          "
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart
              data={data}
              margin={{
                top:
                  10,

                right:
                  8,

                left:
                  0,

                bottom:
                  0,
              }}
            >

              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#0094B6"
                    stopOpacity={
                      0.28
                    }
                  />

                  <stop
                    offset="95%"
                    stopColor="#0094B6"
                    stopOpacity={
                      0
                    }
                  />
                </linearGradient>
              </defs>


              <CartesianGrid
                vertical={
                  false
                }
                stroke="#EAF0F2"
                strokeDasharray="3 4"
              />


              <XAxis
                dataKey="label"
                axisLine={
                  false
                }
                tickLine={
                  false
                }
                minTickGap={
                  24
                }
                tick={{
                  fill:
                    "#82939D",

                  fontSize:
                    10,
                }}
              />


              <YAxis
                axisLine={
                  false
                }
                tickLine={
                  false
                }
                width={
                  56
                }
                tickFormatter={
                  compactNumber
                }
                tick={{
                  fill:
                    "#82939D",

                  fontSize:
                    10,
                }}
              />


              <Tooltip
                content={
                  <ChartTooltip />
                }
                cursor={{
                  stroke:
                    "#B8DCE4",

                  strokeWidth:
                    1,
                }}
              />


              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0094B6"
                strokeWidth={
                  2.6
                }
                fill="url(#revenueGradient)"
                activeDot={{
                  r:
                    5,

                  strokeWidth:
                    3,

                  stroke:
                    "#FFFFFF",

                  fill:
                    "#0094B6",
                }}
              />

            </AreaChart>

          </ResponsiveContainer>
        </div>

      ) : (

        <div
          className="
            mt-4
            rounded-2xl
            border
            border-dashed
            border-[#CAD6DB]
            bg-[#F9FBFC]
            px-5
            py-12
            text-center
            text-xs
            text-[#6D7E8A]
          "
        >
          No revenue data in this
          period.
        </div>

      )}

    </article>
  );
}