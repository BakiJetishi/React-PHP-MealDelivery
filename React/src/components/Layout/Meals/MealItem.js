import { useContext } from 'react';
import MealItemForm from './MealItemForm';
import CartContext from '../../../store/cart-context';

import classes from './MealItem.module.css'

const MealItem = (props) => {
    const cartCtx = useContext(CartContext);

    /**
     * It takes an amount as an argument and then calls the addItem function from the cart context with an
     * object containing the id, name, amount, img, and price of the product.
     */
    const addToCartHandler = amount => {
        cartCtx.addItem({
            id: props.id,
            title: props.title,
            amount: amount,
            img: props.img_url,
            price: props.price
        });
    };

    return (
        <div className={classes.box} >
            <div className={classes.img}>
                <img src={props.img_url} alt="" className={classes.box} />
            </div>
            <div className={classes.text}>
                <div className={classes.title}>{props.title}</div>
                <div className={classes.title2}>{props.body}</div>
                <div className={classes.info}>
                    <div className={classes.price}>$ {props.price}</div>
                    <MealItemForm id={props.id} onAddToCart={addToCartHandler} />
                </div>
            </div>
        </div>
    )
}

export default MealItem