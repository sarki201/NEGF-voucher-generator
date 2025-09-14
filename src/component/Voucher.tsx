import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

const Voucher = () => {
  const [date, setDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [amountInWords, setAmountInWords] = useState<string>("");
  const [pV, setPV] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [payee, setPayee] = useState<string>("");
  const printRef = useRef(null);
  const printRef2 = useRef(null);

  const numberToWords = (amount: number): string => {
    if (isNaN(amount)) return "";

    const [nairaPart, koboPart] = amount.toFixed(2).split(".");
    const naira = parseInt(nairaPart, 10);
    const kobo = parseInt(koboPart, 10);

    const toWords = (num: number): string => {
      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      if (num < 20) return ones[num];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "")
        );
      if (num < 1000)
        return (
          ones[Math.floor(num / 100)] +
          " hundred" +
          (num % 100 ? " and " + toWords(num % 100) : "")
        );
      if (num < 1000000)
        return (
          toWords(Math.floor(num / 1000)) +
          " thousand" +
          (num % 1000 ? " " + toWords(num % 1000) : "")
        );
      if (num < 1000000000)
        return (
          toWords(Math.floor(num / 1000000)) +
          " million" +
          (num % 1000000 ? " " + toWords(num % 1000000) : "")
        );

      return "";
    };

    let result = "";
    if (naira > 0)
      result += toWords(naira) + (naira === 1 ? " naira" : " naira");
    if (kobo > 0) {
      if (result) result += ", ";
      result += toWords(kobo) + (kobo === 1 ? " kobo" : " kobo");
    } else {
      result += " only";
    }

    return result || "zero naira";
  };

  const clearForm = () => {
    setDate("");
    setAmount("");
    setAmountInWords("");
    setPV("");
    setDescription("");
    setPayee("");
    setMonth("");
  };

  const handleDownloadPdf = async () => {
    setIsLoading(true);
    const element = printRef.current;
    const element2 = printRef2.current;
    if (!element) {
      return;
    }
    if (!element2) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const canvas2 = await html2canvas(element2, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");
    const data2 = canvas2.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(data2, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`PV${pV}.pdf`);
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-gray-100 py-8 lg:px-8 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-2xl">
        <h2 className="text-lg lg:text-2xl mt-10 mb-4 font-bold">
          NORTHEAST GOVERNORS' FORUM (NEGF)
        </h2>
        <h4 className="text-base lg:text-lg">Payment voucher generator</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDownloadPdf();
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4 py-6 px-4 lg:px-6 pb-4"
        >
          <div>
            <label className="block text-start text-sm" htmlFor="">
              PV No.
            </label>
            <input
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm block w-full"
              type="text"
              placeholder="e.g 001"
              required
              onChange={(e) => setPV(e.target.value)}
              value={pV}
            />
          </div>
          <div>
            <label className="block text-start text-sm" htmlFor="">
              Date
            </label>
            <input
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm block w-full"
              type="text"
              placeholder="e.g 24/01/2024"
              required
              onChange={(e) => setDate(e.target.value)}
              value={date}
            />
          </div>
          <div>
            <label className="block text-start text-sm" htmlFor="">
              Payee
            </label>
            <input
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm block w-full"
              type="text"
              placeholder="e.g Muhammad Abubakar"
              required
              onChange={(e) => setPayee(e.target.value)}
              value={payee}
            />
          </div>
          <div>
            <label className="block text-start text-sm" htmlFor="">
              Month
            </label>
            <input
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm block w-full"
              type="text"
              placeholder="e.g January 2024"
              required
              onChange={(e) => setMonth(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-start text-sm" htmlFor="">
              Amount
            </label>
            <input
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm block w-full"
              type="text"
              placeholder="e.g 20000.50"
              required
              onChange={(e) => {
                const value = e.target.value;
                setAmount(value);
                const num = parseFloat(value);
                if (!isNaN(num)) {
                  setAmountInWords(numberToWords(num));
                } else {
                  setAmountInWords("");
                }
              }}
              value={amount}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-start text-sm" htmlFor="">
              Description
            </label>
            <textarea
              className="border border-solid border-gray-300 px-4 py-2 rounded-sm resize-none w-full"
              name=""
              id=""
              onChange={(e) => setDescription(e.target.value)}
              placeholder=""
              required
              value={description}
            ></textarea>
          </div>
          <button
            disabled={isLoading}
            className="cursor-pointer bg-green-400 hover:bg-green-700 transition-all duration-300 text-white rounded-sm py-2"
          >
            {isLoading ? "Loading...." : "Print"}
          </button>
          <button
            role="button"
            disabled={isLoading}
            onClick={clearForm}
            className="cursor-pointer hover:bg-gray-100 transition-all duration-300 rounded-sm py-2 text-gray-800 border border-solid border-gray-800"
          >
            Clear
          </button>
        </form>
        <div className="overflow-x-auto">
          <div className="w-[672px] p-5">
            <div ref={printRef} className="p-8 bg-white">
              <div className="flex items-start gap-10 mb-2">
                <img src="/logo.jpg" alt="logo" className="w-23 h-23" />
                <div className="text-center">
                  <h1 className="text-lg font-bold tracking-wide">
                    NORTHEAST GOVERNORS' FORUM (NEGF)
                  </h1>
                  <h3 className="text-base">
                    No. 3 Shehu Laminu Way, Old GRA,
                  </h3>
                  <h3 className="text-base -mt-1">Maiduguri, Borno State</h3>
                </div>
              </div>
              <div className="text-start">
                <h5 className="text-center text-sm mb-2">PAYMENT VOUCHER</h5>
                <div className="grid grid-cols-8 ml-10 mr-4">
                  <div className="col-span-6 pt-4">
                    <h4 className="text-xs pl-4 mb-1">
                      DEPARTMENTAL No. NEGF/{Number(pV)}/2024
                    </h4>
                    <p className="text-[10px] pl-8 border-b border-solid border-black pb-2 mb-2">
                      Payment to be made to{" "}
                      <span className="font-bold uppercase">{payee}</span>
                    </p>
                    <div className="grid grid-cols-20 border-b border-solid border-black">
                      <div className="col-span-2 text-[10px] font-bold border-t border-b border-r border-solid border-black pb-2">
                        Date
                      </div>
                      <div className="col-span-12 text-[10px] font-bold pl-1 pb-2 border-t border-b border-r border-solid border-black">
                        Detailed description of services or goods
                      </div>
                      <div className="col-span-2 text-[10px] font-bold pl-1 pb-2 border-t border-b border-r border-solid border-black">
                        Rate
                      </div>
                      <div className="col-span-4 text-[10px] font-bold pl-1 pb-2 border-t border-b border-solid border-black text-center flex flex-col items-center">
                        <span>Amount</span>
                        <span>₦</span>
                      </div>
                      <div className="col-span-2 text-[10px] italic  border-r border-solid border-black pb-2 -ml-5">
                        {date}
                      </div>
                      <div className="col-span-12 text-[12px] pl-1 pr-1 pb-2   border-r border-solid border-black h-50 relative">
                        {description}
                        <div className="text-5xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-[rotate(45deg)] opacity-30 text-[#ff1010]">
                          ORIGINAL
                        </div>
                      </div>
                      <div className="col-span-2 text-[10px] font-bold pl-1 pb-2  border-r border-solid border-black"></div>
                      <div className="col-span-4 text-[10px] pl-1 pb-2">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(amount))}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 border-b border-solid border-black h-12">
                      <div className="col-span-7 text-[10px]">
                        <p className="font-bold">Total amount in words</p>
                        <p className="uppercase text-[8px]">{amountInWords}</p>
                      </div>
                      <div className="col-span-3 text-[12px] text-end pr-2 flex items-start justify-end">
                        <span className="font-bold mr-2 text-[8px]">TOTAL</span>
                        <span>₦</span>
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(amount))}
                        </span>
                      </div>
                    </div>
                    <p className="text-[8px] font-bold mb-2">
                      Certified that the details above are in accordance with
                      the relevant contract, regulations or other authority
                      under which the Services / Good were provided/ purchased
                    </p>
                    <p className="text-[9px] mb-2">
                      Officer who prepared Voucher Signature:
                      _______________________________
                    </p>
                    <p className=" pl-15 text-[9px] mb-2">
                      Name (in block letters) _______________________________
                    </p>
                    <p className="text-[9px] mb-2">
                      Officer who checked Voucher Signature:
                      _______________________________
                    </p>
                    <p className=" pl-15 text-[9px] pb-1 border-b border-solid border-black">
                      Name (in block letters) _______________________________
                    </p>
                    <p className="text-[9px] mb-1">
                      I certify that the services/goods have been duly
                      performed/received, that the financial authority is held
                      to incur this expenditure and that the relevant D.V.E
                      Account entries have been made
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[8px]">
                        Signiture:__________________________________
                      </p>
                      <div>
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="text-[11px]">For:</span>
                          <div>
                            <p>_____________________________________</p>
                            <p>(DIRECTOR FINANCE & ADMIN)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pr-2 pb-2 border-b border-solid border-black">
                      <p>
                        Name (in block
                        letters):_________________________________
                      </p>
                      <p>Date:______________ 20 ____</p>
                    </div>
                    <p className="text-[9px] mb-1">
                      Received the sum of ______________________________ Naira
                      _________ kobo in payment of the above account this
                      _______ day of _________ 20 ___
                    </p>
                    <div className="flex items-center justify-between text-[9px] pr-2">
                      <p>Withness to mark ___________________________</p>
                      <p> ___________________________</p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pl-22 pr-4 mb-2">
                      <p>(Signature)</p>
                      <p>(Signature of payee)</p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pr-2">
                      <p>Withnessing Official</p>
                      <div>
                        <p className="mb-1">
                          Name:_________________________________
                        </p>
                        <p>Rank:_________________________________</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h5 className="text-[#ee2424] text-center italic font-bold mb-2">
                      ORIGINAL
                    </h5>
                    <div className="border-t border-l border-solid border-black">
                      <div className="pl-2 border-b border-solid border-black mb-1">
                        <p className="text-[8px] mb-1">STATION</p>
                        <p className="text-xs italic pb-2">MAIDUGURI</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px]">MONTHS</p>
                        <p className="text-[10px] italic font-bold pl-4 pb-1 uppercase">
                          {month}
                        </p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px]">PV No.</p>
                        <p className="text-[12px] text-[#ee2424] font-bold pl-4 pb-1">
                          {pV}
                        </p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-6">MDA CODE</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-6">ECON CODE</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1 h-30"></div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-10">MANDATE CHEQUE NO:</p>
                      </div>
                      <div className="pl-2  border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-15 pt-6 pl-2">
                          (Accounts Office Stamp)
                        </p>
                        <div className="border border-solid border-black p-3">
                          <h5 className="text-center text-[8px] mb-8">
                            Internal Audit verification
                          </h5>
                          <h5 className="text-center text-[8px] mb-16">
                            Stamp & Signature
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[672px] absolute left-[-9999px] p-5">
            <div ref={printRef2} className="p-8 bg-white">
              <div className="flex items-start gap-10 mb-2">
                <img src="/logo.jpg" alt="logo" className="w-23 h-23" />
                <div className="text-center">
                  <h1 className="text-lg font-bold tracking-wide">
                    NORTHEAST GOVERNORS' FORUM (NEGF)
                  </h1>
                  <h3 className="text-base">
                    No. 3 Shehu Laminu Way, Old GRA,
                  </h3>
                  <h3 className="text-base -mt-1">Maiduguri, Borno State</h3>
                </div>
              </div>
              <div className="text-start">
                <h5 className="text-center text-sm mb-2">PAYMENT VOUCHER</h5>
                <div className="grid grid-cols-8 ml-10 mr-4">
                  <div className="col-span-6 pt-4">
                    <h4 className="text-xs pl-4 mb-1">
                      DEPARTMENTAL No. NEGF/{Number(pV)}/2024
                    </h4>
                    <p className="text-[10px] pl-8 border-b border-solid border-black pb-2 mb-2">
                      Payment to be made to{" "}
                      <span className="font-bold uppercase">{payee}</span>
                    </p>
                    <div className="grid grid-cols-20 border-b border-solid border-black">
                      <div className="col-span-2 text-[10px] font-bold border-t border-b border-r border-solid border-black pb-2">
                        Date
                      </div>
                      <div className="col-span-12 text-[10px] font-bold pl-1 pb-2 border-t border-b border-r border-solid border-black">
                        Detailed description of services or goods
                      </div>
                      <div className="col-span-2 text-[10px] font-bold pl-1 pb-2 border-t border-b border-r border-solid border-black">
                        Rate
                      </div>
                      <div className="col-span-4 text-[10px] font-bold pl-1 pb-2 border-t border-b border-solid border-black text-center flex flex-col items-center">
                        <span>Amount</span>
                        <span>₦</span>
                      </div>
                      <div className="col-span-2 text-[10px] italic  border-r border-solid border-black pb-2 -ml-5">
                        {date}
                      </div>
                      <div className="col-span-12 text-[12px] pl-1 pr-1 pb-2   border-r border-solid border-black h-50 relative">
                        {description}
                        <div className="text-5xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-[rotate(45deg)] opacity-30 text-[#ff1010]">
                          DUPLICATE
                        </div>
                      </div>
                      <div className="col-span-2 text-[10px] font-bold pl-1 pb-2  border-r border-solid border-black"></div>
                      <div className="col-span-4 text-[10px] pl-1 pb-2">
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(amount))}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-10 border-b border-solid border-black h-12">
                      <div className="col-span-7 text-[10px]">
                        <p className="font-bold">Total amount in words</p>
                        <p className="uppercase text-[8px]">{amountInWords}</p>
                      </div>
                      <div className="col-span-3 text-[12px] text-end pr-2 flex items-start justify-end">
                        <span className="font-bold mr-2 text-[8px]">TOTAL</span>
                        <span>₦</span>
                        <span>
                          {new Intl.NumberFormat("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(Number(amount))}
                        </span>
                      </div>
                    </div>
                    <p className="text-[8px] font-bold mb-2">
                      Certified that the details above are in accordance with
                      the relevant contract, regulations or other authority
                      under which the Services / Good were provided/ purchased
                    </p>
                    <p className="text-[9px] mb-2">
                      Officer who prepared Voucher Signature:
                      _______________________________
                    </p>
                    <p className=" pl-15 text-[9px] mb-2">
                      Name (in block letters) _______________________________
                    </p>
                    <p className="text-[9px] mb-2">
                      Officer who checked Voucher Signature:
                      _______________________________
                    </p>
                    <p className=" pl-15 text-[9px] pb-1 border-b border-solid border-black">
                      Name (in block letters) _______________________________
                    </p>
                    <p className="text-[9px] mb-1">
                      I certify that the services/goods have been duly
                      performed/received, that the financial authority is held
                      to incur this expenditure and that the relevant D.V.E
                      Account entries have been made
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[8px]">
                        Signiture:__________________________________
                      </p>
                      <div>
                        <div className="flex items-center gap-2 text-[9px]">
                          <span className="text-[11px]">For:</span>
                          <div>
                            <p>_____________________________________</p>
                            <p>(DIRECTOR FINANCE & ADMIN)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pr-2 pb-2 border-b border-solid border-black">
                      <p>
                        Name (in block
                        letters):_________________________________
                      </p>
                      <p>Date:______________ 20 ____</p>
                    </div>
                    <p className="text-[9px] mb-1">
                      Received the sum of ______________________________ Naira
                      _________ kobo in payment of the above account this
                      _______ day of _________ 20 ___
                    </p>
                    <div className="flex items-center justify-between text-[9px] pr-2">
                      <p>Withness to mark ___________________________</p>
                      <p> ___________________________</p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pl-22 pr-4 mb-2">
                      <p>(Signature)</p>
                      <p>(Signature of payee)</p>
                    </div>
                    <div className="flex items-center justify-between text-[9px] pr-2">
                      <p>Withnessing Official</p>
                      <div>
                        <p className="mb-1">
                          Name:_________________________________
                        </p>
                        <p>Rank:_________________________________</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <h5 className="text-[#ee2424] text-center italic font-bold mb-2">
                      DUPLICATE
                    </h5>
                    <div className="border-t border-l border-solid border-black">
                      <div className="pl-2 border-b border-solid border-black mb-1">
                        <p className="text-[8px] mb-1">STATION</p>
                        <p className="text-xs italic pb-2">MAIDUGURI</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px]">MONTHS</p>
                        <p className="text-[10px] italic font-bold pl-4 pb-1 uppercase">
                          {month}
                        </p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px]">PV No.</p>
                        <p className="text-[12px] text-[#ee2424] font-bold pl-4 pb-1">
                          {pV}
                        </p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-6">MDA CODE</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-6">ECON CODE</p>
                      </div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1 h-30"></div>
                      <div className="pl-2 border-b border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-10">MANDATE CHEQUE NO:</p>
                      </div>
                      <div className="pl-2  border-t border-solid border-black mb-1">
                        <p className="text-[8px] pb-15 pt-6 pl-2">
                          (Accounts Office Stamp)
                        </p>
                        <div className="border border-solid border-black p-3">
                          <h5 className="text-center text-[8px] mb-8">
                            Internal Audit verification
                          </h5>
                          <h5 className="text-center text-[8px] mb-16">
                            Stamp & Signature
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
