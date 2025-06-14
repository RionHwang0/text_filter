import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import HashtagSection from '../components/HashtagSection';
import FundOverview from '../components/FundOverview';
import InvestmentStrategy from '../components/InvestmentStrategy';
import ReturnRates from '../components/ReturnRates';
import InvestmentCosts from '../components/InvestmentCosts';
import InvestmentRisks from '../components/InvestmentRisks';
import FundManagers from '../components/FundManagers';
import RedemptionProcedure from '../components/RedemptionProcedure';
import TaxationGuide from '../components/TaxationGuide';
import ReferenceLinks from '../components/ReferenceLinks';
import ProductComparison from '../components/ProductComparison';
import dynamic from 'next/dynamic';
import { ProcessedDocument } from '../utils/fileProcessor';

// 다이나믹 임포트로 SimpleAssetChart 로드
const SimpleAssetChart = dynamic(() => import('../components/SimpleAssetChart'), { 
  ssr: false,
  loading: () => <div className="h-[400px] flex items-center justify-center">차트 로딩 중...</div>
});

const generateHashtags = (doc: ProcessedDocument) => {
  // 문서의 내용을 기반으로 해시태그 생성
  const tags = [
    {
      id: 'sp500',
      text: 'S&P500',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">S&P500이 뭔가요?</h3>
          <p className="text-toss-gray-dark">S&P500은 미국을 대표하는 500개 대기업(애플, 구글, 마이크로소프트 등)의 주가를 평균낸 지수입니다. 이 펀드는 그 지수의 움직임을 따라가도록 설계되어 있어서, 미국 주식 시장 전체에 투자하는 효과를 볼 수 있습니다.</p>
        </div>
      ),
    },
    {
      id: 'hedge',
      text: '환헤지',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">환율 변동이 있다던데, 어떤 보호가 되나요?</h3>
          <p className="text-toss-gray-dark">이 펀드는 미국에 투자하지만 우리는 원화로 투자하니까, 달러-원 환율이 변하면 손익에도 영향이 생깁니다. 그래서 이 펀드는 <strong>전체 외화 자산 중 약 90%를 환율 위험으로부터 보호(환헤지)</strong>하고 있어요. 다만 완전히 막아주는 건 아니고, 시장 상황에 따라 일부는 보호되지 않을 수도 있어요.</p>
        </div>
      ),
    },
    {
      id: 'return',
      text: '수익률',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">최근 수익률은 어땠나요?</h3>
          <p className="text-toss-gray-dark">이 펀드는 최근 1년 동안 약 35~36% 수익률을 기록했어요. 클래스(A1, C1 등)마다 수수료 차이로 조금씩 다르긴 하지만, 전반적으로 좋은 성과를 냈다고 볼 수 있어요. 비교 대상인 <strong>S&P500 지수의 수익률은 약 39.5%</strong>였어요.</p>
        </div>
      ),
    },
    {
      id: 'fee',
      text: '수수료',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">펀드마다 수수료가 왜 다르죠?</h3>
          <p className="text-toss-gray-dark">펀드에는 '클래스'라는 종류가 있어요. 온라인에서 직접 가입하면 수수료가 저렴하고 은행이나 증권사 창구에서 가입하면 수수료가 좀 비쌀 수 있어요. 또 어떤 클래스는 처음에 수수료를 먼저 내고(A형), 어떤 클래스는 <strong>매년 조금씩 나눠서 내는 방식(C형)</strong>이에요. 2~3년 이상 투자할 계획이라면, 클래스 선택이 총비용에 큰 영향을 줄 수 있어요.</p>
        </div>
      ),
    },
    {
      id: 'risk',
      text: '투자위험',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">손해 볼 수도 있다던데, 어떤 위험이 있나요?</h3>
          <p className="text-toss-gray-dark">
            네, 이 펀드는 원금이 보장되지 않아요. 아래와 같은 위험이 있어요:<br/><br/>
            주식 시장이 하락하면 펀드 가치도 같이 떨어질 수 있어요.<br/><br/>
            <strong>파생상품(레버리지 등)</strong>은 수익이 클 수도 있지만 손실도 더 커질 수 있어요.<br/><br/>
            환율이 불리하게 움직이면 수익이 줄어들 수 있어요.<br/><br/>
            미국의 정책, 정치 상황 등도 영향을 줘요.<br/><br/>
            그래서 여유 자금으로, 위험을 감수할 준비가 된 상태에서 투자하는 게 중요해요.
          </p>
        </div>
      ),
    },
  ];
  
  // 추가 태그들
  const moreTags = [
    {
      id: 'mom-structure',
      text: '모자형펀드',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">자투자신탁, 모투자신탁이 뭐예요?</h3>
          <p className="text-toss-gray-dark">이 펀드는 '모자형 구조'예요. <strong>자투자신탁(자펀드)</strong>은 우리가 실제로 가입하는 펀드고, 이 자펀드는 <strong>모투자신탁(모펀드)</strong>이라는 다른 펀드에 대부분 자산을 맡겨요. 모펀드는 미국 주식 등에 직접 투자해서 수익을 만들어요. 쉽게 말해, 자펀드는 중간 관리자, 모펀드는 실제 투자자 역할이에요.</p>
        </div>
      ),
    },
    {
      id: 'subscription',
      text: '가입방법',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">이 펀드는 어떻게 가입하나요?</h3>
          <p className="text-toss-gray-dark">이 펀드는 은행이나 증권사, 신한자산운용 홈페이지에서 가입할 수 있어요. 평일 오후 5시 이전에 신청하면, 2일 뒤의 가격으로 매수되고, 5시 이후에 신청하면, 하루 더 지나서 적용돼요. ※ 'D+2', 'D+3' 이런 용어는 기준일 뒤 며칠이라는 뜻이에요.</p>
        </div>
      ),
    },
    {
      id: 'redemption',
      text: '환매',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">환매하면 언제 돈을 받을 수 있나요?</h3>
          <p className="text-toss-gray-dark">환매(=팔기)를 신청하면 다음과 같이 지급돼요:<br/><br/>17시 이전 신청 → 3영업일 뒤에 돈이 들어와요.<br/><br/>17시 이후 신청 → 4영업일 뒤에 지급돼요.<br/><br/>환매 수수료는 없습니다.</p>
        </div>
      ),
    },
    {
      id: 'manager',
      text: '운용자',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">실제 투자하는 사람은 누구예요?</h3>
          <p className="text-toss-gray-dark">이 펀드는 신한자산운용의 퀀트운용센터에서 관리해요.<br/><br/>책임운용역: 양찬규 님 (13년 경력, 5,000억 이상 운용)<br/><br/>부책임운용역: 전형래 님 (4년 경력, 2,000억 이상 운용)<br/><br/>두 분 모두 과거 펀드 운용 성과가 좋은 편이라 신뢰할 수 있어요.</p>
        </div>
      ),
    },
    {
      id: 'tax',
      text: '세금',
      content: (
        <div>
          <h3 className="text-lg font-bold mb-2">수익이 나면 세금을 얼마나 내야 하나요?</h3>
          <p className="text-toss-gray-dark">일반적으로는 <strong>15.4% 세금(이자·배당소득세)</strong>이 자동으로 빠져나가요. 하지만 한 해 금융소득이 2천만원을 넘으면 종합소득세 신고 대상이 돼요. 또한:<br/><br/>연금저축, 퇴직연금 계좌로 가입한 경우에는 별도의 세율이 적용돼요.<br/>※ 세금은 개인 상황에 따라 다르니, 전문가에게 확인해보는 게 좋아요.</p>
        </div>
      ),
    },
  ];
  
  return [...tags, ...moreTags];
};

const ResultPage: React.FC = () => {
  const router = useRouter();
  const [document, setDocument] = useState<ProcessedDocument | null>(null);
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailMode, setIsDetailMode] = useState(false);

  // 펀드 개요 데이터
  const fundOverviewData = {
    name: '증권자투자신탁(H)[주식-파생형]',
    code: 'DT432',
    setupDate: '없음 (모집: 2023.05.08 예정, 존속기간: 무제한)',
    manager: '신한자산운용(주)',
    type: '증권형(주식-파생형) / 개방형 / 추가형 / 모자형',
    index: 'S&P500 (USD 기준)',
    riskLevel: '2등급 (중위험)',
    protection: '예금자보호법 미적용 (원금 비보장)',
  };

  // 수익률 데이터
  const returnRateData = [
    { class: 'A1 (오프라인)', yearReturn: 35.73, setupReturn: 23.57 },
    { class: 'C1 (오프라인)', yearReturn: 35.13, setupReturn: 23.04 },
    { class: 'A-e (온라인)', yearReturn: 36.32, setupReturn: 24.12 },
    { class: 'C-e (온라인)', yearReturn: 36.20, setupReturn: 20.49 },
  ];
  const benchmarkReturn = 39.52;

  // 투자비용 데이터
  const costData = [
    { class: 'A1', salesFee: '1.0% 이내', totalFee: '1.08%', threeYearCost: '361천원' },
    { class: 'C1', salesFee: '없음', totalFee: '1.69%', threeYearCost: '396천원' },
    { class: 'A-e', salesFee: '0.2% 이내', totalFee: '0.81%', threeYearCost: '146천원' },
    { class: 'C-e', salesFee: '없음', totalFee: '1.15%', threeYearCost: '206천원' },
  ];

  // 운용인력 데이터
  const managerData = [
    { name: '양찬규', position: '책임운용역', amount: '5,266억원', performance: '32.74%' },
    { name: '전형래', position: '부책임운용역', amount: '2,045억원', performance: '35.11%' },
  ];

  useEffect(() => {
    // 로컬 스토리지에서 처리된 문서 데이터 가져오기
    const storedData = localStorage.getItem('processedDocument');
    
    if (storedData) {
      try {
        const doc = JSON.parse(storedData) as ProcessedDocument;
        setDocument(doc);
        setHashtags(generateHashtags(doc));
        setLoading(false);
      } catch (error) {
        console.error('저장된 문서 데이터 처리 오류:', error);
        router.push('/');
      }
    } else {
      // 데이터가 없으면 메인 페이지로 리다이렉트
      router.push('/');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-toss-blue rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-toss-gray-dark">문서 분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>미국 대표 500개 기업에 한 번에 투자하세요. - 텍스트 필터</title>
        <meta name="description" content="텍스트 필터로 생성된 가독성 높은 웹페이지" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="flex items-center text-toss-blue"
                onClick={() => router.push('/')}
              >
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>홈으로</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDetailMode(!isDetailMode)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  isDetailMode 
                    ? 'bg-toss-blue text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {isDetailMode ? '간단히 보기' : '자세히 보기'}
              </button>
              <div className="text-toss-gray">가독성 향상 서비스</div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-toss-black mb-2">미국 대표 500개 기업에 한 번에 투자하세요.</h1>
          <p className="text-toss-gray">
            애플부터 아마존까지, S&P500 지수를 따라가는 글로벌 분산투자 펀드입니다.
          </p>
        </div>

        {/* 해시태그 섹션 */}
        <HashtagSection tags={hashtags} />

        {/* 간단 모드일 때 */}
        {!isDetailMode ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <FundOverview fund={fundOverviewData} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <ReturnRates returnData={returnRateData} benchmarkReturn={benchmarkReturn} />
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <SimpleAssetChart />
            </div>
          </div>
        ) : (
          // 자세히 모드일 때 - 기존 컴포넌트들
          <>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <FundOverview fund={fundOverviewData} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <InvestmentStrategy />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <ReturnRates returnData={returnRateData} benchmarkReturn={benchmarkReturn} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <SimpleAssetChart />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <ProductComparison />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <InvestmentCosts costs={costData} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <InvestmentRisks />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <FundManagers managers={managerData} />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <RedemptionProcedure />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <TaxationGuide />
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <ReferenceLinks />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-toss-gray">
            <p>© 2025 텍스트 필터. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultPage; 