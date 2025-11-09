function TextInputSection({ text, setText, onProcess, onClear }) {
  return (
    <section className="mb-12 bg-white rounded-xl shadow-md p-6 md:p-8 max-w-4xl mx-auto transform transition-all duration-500 hover:shadow-lg">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <i className="fa fa-pencil-square-o text-primary mr-2"></i>输入文本内容
      </h3>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="mixed-text" className="block text-sm font-medium text-neutral-700 mb-2">
            输入日语文本
          </label>
          <textarea
            id="mixed-text"
            rows="10"
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none text-lg"
            placeholder="请输入日语文本，例如：
電話で女の学生と男の学生が話しています。男の学生は明日何をしなければなりませんか。
女：もしもし、伊藤君、私田中だけど。明日のサークルのミーティングが急用で出られなくなっちゃったから代わりに仕切ってくれない？
男：はい、わかりました。何か特別に準備することはありますか？"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="mt-1 text-sm text-neutral-500">
            <i className="fa fa-info-circle mr-1"></i> 系统会按句号自动断句，并识别性别标识（如"女："、"男："）
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
          <button
            onClick={onClear}
            className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-all flex items-center justify-center"
          >
            <i className="fa fa-eraser mr-2"></i>清空
          </button>
          <button
            onClick={onProcess}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center font-medium"
          >
            <i className="fa fa-magic mr-2"></i>处理文本
          </button>
        </div>
      </div>
    </section>
  );
}

export default TextInputSection;
