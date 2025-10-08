import { test, expect } from '@playwright/test';

// กำหนด URL ของหน้าเว็บ Quasar (ใช้ base url จาก Playwright config)
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Form Validation and Reset Test', () => {

  test('should validate the form inputs correctly and reset the form', async ({ page }) => {
    // 1. ตรวจสอบว่าหน้าหลักโหลดสำเร็จ
    await expect(page).toHaveTitle(/Quasar App/);

    // --- Selectors (ตัวเลือก) สำหรับฟอร์ม ---
    const nameInput = page.getByLabel('Name');
    const ageInput = page.getByLabel('Age');
    const termsCheckbox = page.getByLabel('I accept the license and terms');
    const submitButton = page.getByRole('button', { name: 'Submit' });
    const resetButton = page.getByRole('button', { name: 'Reset' });

    // --- 2. ทดสอบการใส่ข้อมูลลงในฟอร์ม ---

    // ใส่ชื่อ
    await nameInput.fill('Nichakorn Kantup');

    // ใส่ Age (เปลี่ยนเป็น 20 ตามที่ร้องขอ)
    await ageInput.fill('20'); // <-- แก้ไขตรงนี้

    // คลิกยอมรับ Terms
    await termsCheckbox.check();

    // --- 3. ตรวจสอบค่าที่ใส่เข้าไป (Assertion) ---

    // ตรวจสอบค่า Name
    await expect(nameInput).toHaveValue('Nichakorn Kantup');

    // ตรวจสอบค่า Age
    await expect(ageInput).toHaveValue('20'); // <-- ตรวจสอบค่า 20

    // ตรวจสอบสถานะ Terms
    await expect(termsCheckbox).toBeChecked();

    // ตรวจสอบว่าปุ่ม Submit เปิดใช้งาน (ถ้าฟอร์มสมบูรณ์)
    await expect(submitButton).toBeEnabled();

    // --- 4. ทดสอบปุ่ม Reset ---

    await resetButton.click();

    // ตรวจสอบว่าช่อง Name ถูกเคลียร์
    await expect(nameInput).toHaveValue('');

    // ตรวจสอบว่าช่อง Age ถูกเคลียร์
    await expect(ageInput).toHaveValue('');

    // ตรวจสอบว่า Terms ถูกยกเลิกการเลือก
    await expect(termsCheckbox).not.toBeChecked();

    // ตรวจสอบว่าปุ่ม Submit ถูกปิดใช้งานหลังจาก Reset (เนื่องจากฟอร์มไม่สมบูรณ์)
    await expect(submitButton).toBeDisabled();

    // ตรวจสอบว่าปุ่ม Reset ยังคงอยู่
    await expect(resetButton).toBeVisible();

  });
});
