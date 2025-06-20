import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [htmlResult, setHtmlResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 파일 선택 시 호출되는 핸들러
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // 폼 제출 시, 파일을 백엔드로 전송하는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('이미지 파일을 선택해 주세요.');
      return;
    }
    
    setError('');
    setLoading(true);
    setHtmlResult('');
    
    // FormData 객체에 파일과 추가 데이터를 담습니다.
    const formData = new FormData();
    formData.append('image', selectedFile);

    const promptText = `
      이 이미지는 웹사이트의 디자인 레이아웃입니다. 
      HTML과 CSS를 사용하여 이 웹사이트를 구현해야 합니다. 

      사이트는 일반적으로 다음과 같은 섹션으로 구성됩니다:
      1. 헤더(Header): 로고, 네비게이션 바, 사용자 아이콘 포함.
      2. 메인 섹션: 배경 이미지 및 브랜드 메시지 포함.
      3. 카테고리/제품 리스트: 주요 제품을 그리드 형식으로 배치.
      4. 특집 섹션: 프로모션 또는 브랜드 소개 섹션 포함.
      5. 리뷰 섹션: 고객 리뷰 및 피드백.
      6. 문의/예약 섹션: 방문 예약 또는 연락처 정보.
      7. 푸터(Footer): 회사 소개, 고객 지원, 소셜 미디어 링크 포함.
      8. 결과물의 가로 크기는 이미지와 동일해야합니다. 그 외의 여백은 회색 배경으로 채워주세요. 이 떄 크기는 max-width로 지정해주세요

      HTML은 적절한 div 및 section 태그를 활용하여 구조를 반영해야 하며,
      CSS는 flexbox 및 grid 레이아웃을 사용하여 디자인을 구현해야 합니다.
    `;

     formData.append('prompt', promptText); // 🔹 프롬프트 추가
    
    try {
      // 백엔드 API 엔드포인트에 POST 요청 (포트 번호를 3000으로 변경)
      const response = await fetch('http://localhost:3000/api/process-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }
      
      const data = await response.json();
      // 백엔드가 { result: "생성된 HTML 코드" } 형식으로 응답한다고 가정합니다.
      setHtmlResult(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  ;// 새 창에서 HTML 결과를 렌더링하여 보여주는 함수
  const handleView = () => {
    if (!htmlResult) return;
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(htmlResult);
    newWindow.document.close();
  };

  // HTML 결과를 index.html 파일로 다운로드하는 함수
  const handleDownload = () => {
    if (!htmlResult) return;
    const blob = new Blob([htmlResult], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ margin: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>디자인 이미지 → HTML 변환기</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          style={{ marginBottom: '1rem' }}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? '처리 중...' : '이미지 변환하기'}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          에러: {error}
        </div>
      )}
      
      {htmlResult && (
        <div style={{ marginTop: '2rem' }}>
          <h2>생성된 HTML</h2>
          {/* HTML 결과를 미리보기용 <pre>로 보여줌 */}
          <pre 
            style={{ 
              background: '#f8f8f8', 
              padding: '1rem', 
              border: '1px solid #ddd',
              whiteSpace: 'pre-wrap'
            }}
          >
            {htmlResult}
          </pre>
          <div style={{ marginTop: '1rem' }}>
            {/* 새 창에서 HTML 렌더링 */}
            <button onClick={handleView} style={{ marginRight: '1rem' }}>
              새 창에서 보기
            </button>
            {/* index.html 파일로 다운로드 */}
            <button onClick={handleDownload}>
              index.html로 다운로드
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
