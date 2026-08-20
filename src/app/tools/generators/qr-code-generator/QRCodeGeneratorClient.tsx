"use client";

import { useState, useEffect, useCallback } from "react";
import { trackToolUsed, trackDownload, trackCopy } from "@/lib/analytics";
import QRCode from "qrcode";

type QRType = "text" | "url" | "email" | "phone" | "sms" | "wifi";
type ErrorLevel = "L" | "M" | "Q" | "H";
type WifiEncryption = "WPA" | "WEP" | "nopass";

interface EmailData {
  email: string;
  subject: string;
  body: string;
}

interface SmsData {
  phone: string;
  message: string;
}

interface WifiData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

function escapeWifi(value: string): string {
  return value.replace(/([\\;,":])/g, "\\$1");
}

function buildContent(
  type: QRType,
  text: string,
  email: EmailData,
  sms: SmsData,
  wifi: WifiData
): string {
  switch (type) {
    case "text":
      return text;
    case "url":
      if (!text) return "";
      return text.startsWith("http://") || text.startsWith("https://")
        ? text
        : `https://${text}`;
    case "email": {
      if (!email.email) return "";
      const params = new URLSearchParams();
      if (email.subject) params.append("subject", email.subject);
      if (email.body) params.append("body", email.body);
      const qs = params.toString();
      return `mailto:${email.email}${qs ? "?" + qs : ""}`;
    }
    case "phone":
      return text ? `tel:${text}` : "";
    case "sms":
      if (!sms.phone) return "";
      return sms.message
        ? `SMSTO:${sms.phone}:${sms.message}`
        : `SMSTO:${sms.phone}`;
    case "wifi":
      if (!wifi.ssid) return "";
      return `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};${
        wifi.encryption !== "nopass" ? `P:${escapeWifi(wifi.password)};` : ""
      }${wifi.hidden ? "H:true;" : ""};`;
    default:
      return "";
  }
}

export default function QRCodeGeneratorClient() {
  const [type, setType] = useState<QRType>("text");
  const [text, setText] = useState("");
  const [email, setEmail] = useState<EmailData>({
    email: "",
    subject: "",
    body: "",
  });
  const [sms, setSms] = useState<SmsData>({ phone: "", message: "" });
  const [wifi, setWifi] = useState<WifiData>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });

  const [size, setSize] = useState(512);
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [fgColor, setFgColor] = useState("#0d3b36");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const content = buildContent(type, text, email, sms, wifi);

  const generateQR = useCallback(async () => {
    trackToolUsed("qr-code-generator", "generators");
    if (!content) {
      setDataUrl("");
      setError("");
      return;
    }

    try {
      const url = await QRCode.toDataURL(content, {
        width: size,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        margin: 2,
      });
      setDataUrl(url);
      setError("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to generate QR code."
      );
      setDataUrl("");
    }
  }, [content, size, errorLevel, fgColor, bgColor]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = () => {
    trackDownload("qr-code-generator", "generators");
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyImage = async () => {
    trackCopy("qr-code-generator", "generators");
    if (!dataUrl) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copia o dataURL como texto
      try {
        await navigator.clipboard.writeText(dataUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silêncio
      }
    }
  };

  const typeOptions: Array<{ value: QRType; label: string; icon: string }> = [
    { value: "text", label: "TEXT", icon: "📝" },
    { value: "url", label: "URL", icon: "🔗" },
    { value: "email", label: "EMAIL", icon: "✉️" },
    { value: "phone", label: "PHONE", icon: "📞" },
    { value: "sms", label: "SMS", icon: "💬" },
    { value: "wifi", label: "WI-FI", icon: "📶" },
  ];

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Seletor de tipo */}
      <div>
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
          QR CODE TYPE
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setType(opt.value)}
              className={`font-mono text-[10px] tracking-widest px-2 py-3 rounded-lg transition-colors ${
                type === opt.value
                  ? "bg-deep text-paper"
                  : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
              }`}
            >
              <span className="text-lg block mb-1">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs por tipo */}
      <div className="border-t border-ink/10 pt-5">
        {type === "text" && (
          <div>
            <label
              htmlFor="qr-text"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              YOUR TEXT
            </label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste any text here..."
              rows={3}
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
        )}

        {type === "url" && (
          <div>
            <label
              htmlFor="qr-url"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              URL / WEBSITE
            </label>
            <input
              id="qr-url"
              type="url"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="example.com or https://example.com"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        )}

        {type === "email" && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="qr-email"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="qr-email"
                type="email"
                value={email.email}
                onChange={(e) =>
                  setEmail({ ...email, email: e.target.value })
                }
                placeholder="hello@example.com"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="qr-email-subject"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                SUBJECT (OPTIONAL)
              </label>
              <input
                id="qr-email-subject"
                type="text"
                value={email.subject}
                onChange={(e) =>
                  setEmail({ ...email, subject: e.target.value })
                }
                placeholder="Hello!"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="qr-email-body"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                MESSAGE (OPTIONAL)
              </label>
              <textarea
                id="qr-email-body"
                value={email.body}
                onChange={(e) => setEmail({ ...email, body: e.target.value })}
                placeholder="Your message..."
                rows={2}
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>
        )}

        {type === "phone" && (
          <div>
            <label
              htmlFor="qr-phone"
              className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
            >
              PHONE NUMBER
            </label>
            <input
              id="qr-phone"
              type="tel"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="+1 555 123 4567"
              className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        )}

        {type === "sms" && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="qr-sms-phone"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                PHONE NUMBER
              </label>
              <input
                id="qr-sms-phone"
                type="tel"
                value={sms.phone}
                onChange={(e) => setSms({ ...sms, phone: e.target.value })}
                placeholder="+1 555 123 4567"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label
                htmlFor="qr-sms-message"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                MESSAGE (OPTIONAL)
              </label>
              <textarea
                id="qr-sms-message"
                value={sms.message}
                onChange={(e) => setSms({ ...sms, message: e.target.value })}
                placeholder="Your message..."
                rows={2}
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
            </div>
          </div>
        )}

        {type === "wifi" && (
          <div className="space-y-3">
            <div>
              <label
                htmlFor="qr-wifi-ssid"
                className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
              >
                NETWORK NAME (SSID)
              </label>
              <input
                id="qr-wifi-ssid"
                type="text"
                value={wifi.ssid}
                onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                placeholder="MyWiFiNetwork"
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="qr-wifi-enc"
                  className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
                >
                  ENCRYPTION
                </label>
                <select
                  id="qr-wifi-enc"
                  value={wifi.encryption}
                  onChange={(e) =>
                    setWifi({
                      ...wifi,
                      encryption: e.target.value as WifiEncryption,
                    })
                  }
                  className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="WPA">WPA / WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (open)</option>
                </select>
              </div>
              {wifi.encryption !== "nopass" && (
                <div>
                  <label
                    htmlFor="qr-wifi-pass"
                    className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
                  >
                    PASSWORD
                  </label>
                  <input
                    id="qr-wifi-pass"
                    type="text"
                    value={wifi.password}
                    onChange={(e) =>
                      setWifi({ ...wifi, password: e.target.value })
                    }
                    placeholder="MyPassword123"
                    className="w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              )}
            </div>
            <label className="flex items-center gap-3 cursor-pointer bg-paper border border-ink/10 rounded-lg px-3 py-2.5 hover:border-accent transition-colors w-fit">
              <input
                type="checkbox"
                checked={wifi.hidden}
                onChange={(e) =>
                  setWifi({ ...wifi, hidden: e.target.checked })
                }
                className="w-4 h-4 accent-accent cursor-pointer"
              />
              <span className="text-sm text-ink select-none">
                Hidden network
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Customização */}
      <div className="border-t border-ink/10 pt-5 grid sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="qr-size"
              className="font-mono text-xs tracking-widest text-ink/60"
            >
              SIZE (PX)
            </label>
            <span className="font-mono text-sm font-semibold text-accent">
              {size}
            </span>
          </div>
          <input
            id="qr-size"
            type="range"
            min="128"
            max="1024"
            step="64"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
        </div>

        <div>
          <label
            htmlFor="qr-error"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            ERROR CORRECTION
          </label>
          <select
            id="qr-error"
            value={errorLevel}
            onChange={(e) => setErrorLevel(e.target.value as ErrorLevel)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="L">Low (~7%)</option>
            <option value="M">Medium (~15%)</option>
            <option value="Q">Quartile (~25%)</option>
            <option value="H">High (~30%)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="qr-fg"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            FOREGROUND COLOR
          </label>
          <div className="flex gap-2">
            <input
              id="qr-fg"
              type="color"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="h-10 w-14 rounded-lg border border-ink/15 cursor-pointer"
            />
            <input
              type="text"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              className="flex-1 border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="qr-bg"
            className="font-mono text-xs tracking-widest text-ink/60 block mb-2"
          >
            BACKGROUND COLOR
          </label>
          <div className="flex gap-2">
            <input
              id="qr-bg"
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-14 rounded-lg border border-ink/15 cursor-pointer"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 border border-ink/15 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Preview do QR Code */}
      <div className="border-t border-ink/10 pt-5">
        <span className="font-mono text-xs tracking-widest text-ink/60 block mb-3">
          PREVIEW
        </span>
        {dataUrl ? (
          <div className="flex flex-col items-center gap-4">
            <div
              className="p-4 rounded-lg border border-ink/10"
              style={{ backgroundColor: bgColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="Generated QR Code"
                width={256}
                height={256}
                className="block"
                style={{ imageRendering: "pixelated" }}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                type="button"
                onClick={downloadPNG}
                className="font-mono text-xs tracking-widest bg-deep text-paper hover:bg-accent transition-colors rounded-full px-6 py-3"
              >
                ⬇ DOWNLOAD PNG
              </button>
              <button
                type="button"
                onClick={copyImage}
                className={`font-mono text-xs tracking-widest rounded-full px-6 py-3 transition-colors ${
                  copied
                    ? "bg-accent text-paper"
                    : "bg-paper text-ink border border-ink/15 hover:border-accent hover:text-accent"
                }`}
              >
                {copied ? "✓ COPIED" : "📋 COPY IMAGE"}
              </button>
            </div>
          </div>
        ) : error ? (
          <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
            <p className="text-sm text-accent font-medium">⚠️ {error}</p>
          </div>
        ) : (
          <div className="bg-paper border border-dashed border-ink/15 rounded-lg py-12 flex items-center justify-center">
            <p className="text-sm text-ink/40 italic">
              Enter content above to generate your QR code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}