import Slider, { SliderRef } from '@/components/slider';
import React, { useContext, useRef, useState } from 'react';
import cls from 'classnames';
import { getPX, getImgUrl } from '@/utils';
import Icon from '@/components/icon';
import { useNav } from '@/routers/nav';
import RoutePath from '@/routers/path';
import { HomeContext } from '@/containers/home';
import BookCover from '@/components/book-cover';
import { BookItem } from '@/service/type';

import './index.less';
import { Tea } from '@/utils/tea';

interface BookSliderProps {
    onChange: (i: number) => void;
    containerRef: React.RefObject<HTMLDivElement>;
}

const BookItemWidth = 104;
const BookItemHeight = 148;
const BookItemScale = 0.6;
const BookItemPadding = 7;
const BookMaxShow = 3;

const BookSlider = ({ onChange, containerRef }: BookSliderProps) => {
    const { navTo } = useNav();
    const { bookList } = useContext(HomeContext);
    const sliderRef = useRef<SliderRef>(null);
    const [offset, setOffset] = useState(0);

    const showPrevBook = offset > 0;
    const showNextBook = -offset > 0;
    const hideCurBook = offset > getPX(153);

    const bookNum = Math.min(bookList?.length || 0, BookMaxShow);

    return (
        <div className="home-book-slider">
            <div
                className="slider-wrapper"
                style={{
                    width: getPX(
                        BookItemWidth + (bookNum - 1) * BookItemWidth * BookItemScale + bookNum * BookItemPadding,
                    ),
                }}
            >
                <Slider
                    ref={sliderRef}
                    getTouchContainer={() => containerRef.current}
                    className={cls({
                        'show-next-book': showNextBook,
                        'show-prev-book': showPrevBook,
                        'hide-cur-book': hideCurBook,
                    })}
                    width={getPX(BookItemWidth)}
                    height={getPX(BookItemHeight)}
                    padding={getPX(BookItemPadding)}
                    scale={BookItemScale}
                    fakeNum={2}
                    showNum={BookMaxShow}
                    duration={0.3}
                    onChange={onChange}
                    itemKey={(item: BookItem) => item.book_id}
                    data={bookList}
                    onOffsetChange={setOffset}
                    renderSliderItem={(item: BookItem) => (
                        <BookCover
                            className="book-item"
                            src={getImgUrl({
                                uri: item.thumb_uri,
                            })}
                            hasContest={Boolean(item.contest_id)}
                        />
                    )}
                />
            </div>
            <div
                className="create-book"
                onClick={() => {
                    Tea('click_book_creation');
                    navTo(RoutePath.BookEdit);
                }}
            >
                <Icon type="add" />
            </div>
        </div>
    );
};
export default BookSlider;
