import io
from pypdf import PdfReader

def extract_text_from_pdf(pdf_bytes):
    """
    Extracts text from PDF bytes using pypdf.
    Extremely robust and handles multiple pages.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error extracting PDF text: {str(e)}")
        raise Exception(f"Failed to parse PDF resume: {str(e)}")
