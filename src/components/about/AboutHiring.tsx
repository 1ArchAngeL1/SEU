'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Upload } from 'lucide-react';
import FadeIn from '@/components/FadeIn';
import { useTranslations } from 'next-intl';
import { filesService } from '@/service/files.service';
import { useCreateResume } from '@/hooks/queries/use-resumes';

export default function AboutHiring() {
  const t = useTranslations('about');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const createResume = useCreateResume();

  const busy = uploading || createResume.isPending;

  const handlePick = () => {
    if (busy) return;
    setError('');
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so the same file can be re-selected later.
    e.target.value = '';
    if (!file) return;

    setError('');
    setSubmitted(false);
    setUploading(true);
    try {
      const uploaded = await filesService.upload(file);
      setUploading(false);
      await createResume.mutateAsync({
        fileId: uploaded.uuid,
        fileName: uploaded.originalName,
        position: t('marketing'),
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      setError(t('resumeError'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-pale-gray py-20 lg:py-28">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Left - Title, Resume upload & Info Box */}
          <FadeIn direction="left" className="w-full lg:w-1/2 flex flex-col justify-between pr-0 lg:pr-20">
            <div>
              <h2 className="font-[--font-bodoni] font-normal text-seu-title text-dark-green uppercase mb-4">
                {t('weAreHiring')}
              </h2>

              {/* Resume upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handlePick}
                  disabled={busy}
                  className="flex items-center gap-3 bg-primary-green text-white font-montserrat font-medium text-seu-caption px-8 py-3 rounded-lg hover:bg-primary-green/85 active:scale-[0.98] transition-all uppercase disabled:opacity-60"
                >
                  {busy ? t('resumeUploading') : t('sendResume')}
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                </button>

                {submitted && (
                  <span className="flex items-center gap-2 text-primary-green font-montserrat text-seu-caption">
                    <CheckCircle2 className="size-5" />
                    {t('resumeSent')}
                  </span>
                )}
                {error && (
                  <span className="flex items-center gap-2 text-red font-montserrat text-seu-caption">
                    <AlertCircle className="size-4" />
                    {error}
                  </span>
                )}
              </div>
            </div>

            {/* Dark info box */}
            <div className="mt-8 lg:mt-auto -ml-5 lg:-ml-10 -mr-0 lg:-mr-20 bg-dark-green px-5 lg:px-10 py-16">
              <p className="font-montserrat font-medium text-seu-body text-pale-gray leading-relaxed">
                {t('hiringDescription')}
              </p>
            </div>
          </FadeIn>

          {/* Right - Job Listing */}
          <FadeIn direction="right" delay={200} className="w-full lg:w-1/2 bg-white/60 border border-dark-green/10 rounded-lg p-10">
            <h3 className="font-[--font-bodoni] font-normal text-seu-heading text-dark-green uppercase mb-2">
              {t('marketing')}
            </h3>
            <p className="font-montserrat font-semibold text-seu-caption-sm text-secondary-grey leading-tight mb-4">
              {t('marketingDesc1')}
            </p>

            <hr className="border-dark-green/15 mb-6" />

            <div className="space-y-5 font-montserrat font-normal text-seu-caption text-secondary-grey leading-relaxed">
              <p>{t('marketingText1')}</p>

              <p>{t('marketingText2')}</p>

              <p>{t('marketingText3')}</p>

              <p>{t('marketingText4')}</p>

              <p>{t('marketingText5')}</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
