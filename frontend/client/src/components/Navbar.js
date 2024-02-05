import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from 'features/user';

const Navbar = () => {
	const dispatch = useDispatch();
	const { isAuthenticated } = useSelector(state => state.user);

	const authLinks = (
		<>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/dashboard'>
					dashboard
				</NavLink>
			</li>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/files'>
					my notes
				</NavLink>
			</li>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/files/create'>
					new note
				</NavLink>
			</li>
			<li className='nav-item'>
				<a className='nav-link' href='#!' onClick={() => dispatch(logout())}>
					logout
				</a>
			</li>
		</>
	);

	const guestLinks = (
		<>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/login'>
					login
				</NavLink>
			</li>
			<li className='nav-item'>
				<NavLink className='nav-link' to='/register'>
					register
				</NavLink>
			</li>
		</>
	);

	return (
		<nav className='navbar navbar-expand-lg bg-light'>
			<div className='container-fluid'>
				<Link className='navbar-brand' to='/'>
					SimpleNotes
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-bs-toggle='collapse'
					data-bs-target='#navbarNav'
					aria-controls='navbarNav'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbarNav'>
					<ul className='navbar-nav'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/'>
								home
							</NavLink>
						</li>
						{isAuthenticated ? authLinks : guestLinks}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
